import React, { useEffect, useState } from "react";
import Event from "./components/Event";
import {
  StringTypeDTO,
  RelationDTO,
  RelationType,
  SelfDTO,
  ValueDTO,
  GraphDTO,
  DCREventDTO,
  KindDTO,
  KindDTOMap,
} from "./types/graph";
import Relation from "./components/Relation";
import useWebSocket, { ReadyState } from "react-use-websocket";
import {
  Alert,
  Button,
  Box,
  Snackbar,
  Stack,
  Typography,
  Divider,
  CircularProgress,
  LinearProgress,
  Card,
  Input,
  TextField,
  DialogContent,
  Dialog,
  DialogContentText,
  DialogTitle,
  Modal,
} from "@mui/material";
import logo from "./logo.png";
import tardis_logo from "./tardis_logo.png";
import { executeEvent, getEvents } from "./api/graph";

const url = window.location.hostname;

const Toggle = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        // flexGrow: 1,
        gap: "0.5rem",
        padding: "0.5rem",
      }}
    >
      <Modal open={open} onClose={() => setOpen(false)}>
        <Dialog
          open={true}
          onClose={() => setOpen(false)}
          fullWidth
          maxWidth="sm"
          sx={{ zIndex: 10000 }}
        >
          <DialogTitle
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: "1.5rem" }}>Settings</span>
            <Button
              onClick={() => setOpen(false)}
              sx={{
                // position: "absolute",
                // right: 8,
                // top: 8,
                minWidth: 0,
                padding: 0,
              }}
              size="small"
            >
              <span style={{ fontSize: "1.5rem" }}>×</span>
            </Button>
          </DialogTitle>
          <DialogContent>{children}</DialogContent>
        </Dialog>
      </Modal>
      <Button variant="text" size="small" onClick={() => setOpen(!open)}>
        {open ? "-" : "+"}
      </Button>
      {/* {open && <Button onClick={() => setOpen(false)}>-</Button>}
      {open && children}
      {!open && <Button onClick={() => setOpen(true)}>+</Button>} */}
    </div>
  );
};

let stringFy = (self: SelfDTO): string => {
  let params = self.params;
  // map((param) => `${param.name}: ${param.value}`);
  let paramsString = Object.entries(params)
    .map(([key, value]) => `${key}: ${value.value}`)
    .join(", ");
  return `${self.role}(${paramsString})`;
};

const Header = ({
  self,
  port,
}: {
  self?: SelfDTO;
  port: { value: number; set: (port: number) => void };
}) => (
  <Box
    sx={{
      width: "100%",
      padding: 2,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      //   justifyContent: "space-evenly",
      flexWrap: "wrap",
      //   flexGrow: 4,
      gap: 2,
    }}
  >
    <img width={75} src={tardis_logo} alt="Logo" />
    <Card
      variant="outlined"
      sx={{ padding: 1, display: "flex", flexDirection: "row" }}
    >
      <Typography>
        <b>Participant</b>
        <Typography>{self ? `${stringFy(self)}` : "not connected"}</Typography>
      </Typography>
      <Toggle>
        <TextField
          sx={{ "margin-top": 10 }}
          variant="outlined"
          label="Port"
          type="text"
          size="small"
          value={port.value}
          onChange={(e) => port.set(parseInt(e.target.value) || 0)}
        />
        {/* IP: <input value={ip} onChange={(e) => setIp(e.target.value)} /> */}
      </Toggle>
    </Card>
    {/* <Typography variant="h4">DCR Choreography Viewer</Typography> */}
  </Box>
);

function App() {
  const [port, setPort] = useState<number>(1234);
  const [self, selfSet] = useState<SelfDTO | undefined>(undefined);

  let { lastMessage: lastEventMessage, readyState } = useWebSocket(
    `ws://${url}:${port}/dcr`,
    {
      onOpen: () => {
        console.log("opened connection");
      },
      onClose: () => console.log("closed connection"),
      onMessage: (msg) => {
        // console.log("Received message", msg);
        var message = JSON.parse(msg.data);
        console.log(message);
        selfSet(message.self || undefined);
        setEvents(message.events || []);
      },
      reconnectInterval: 1000,
      shouldReconnect: () => true,
      onError: (e) => {
        console.error(e);
        selfSet(undefined);
        setEvents([]);
      },
    }
  );

  let [events, setEvents] = React.useState<DCREventDTO[]>(
    lastEventMessage ? 
    JSON.parse(lastEventMessage.data)
     : []
  );

  useEffect(() => {
    getEvents(`http://${url}:${port}/rest/dcr/events/enable`)
      .then((response) => response.json())
      // .then((data) => {
      //   console.log("Events enabled:", data.events);
      // })
      .catch((error) => {
        console.error("Error enabling events:", error);
        // setEvents([]);
      });
  }, [readyState, port]);

  return (<div style={{ overflow: "scroll" }}>
    <Card
      sx={{
        // padding: "1rem",
        "margin-top": "1rem",
        minWidth: 350,
        width: "100%",
        // height: "calc(100vh - 2rem)",
        height: "100%",
        // maxWidth: "100%",
        boxSizing: "border-box",
      }}
      variant="outlined"
      
    >
      <Header self={self} port={{ value: port, set: setPort }} />
      {/* <Button
        variant="outlined"
        onClick={() => {
          getEvents(`http://${url}:${port}/rest/dcr/events/enable`).catch(
            (error) => {
              console.error(error);
              setEvents([]);
            }
          );
        }}
      >
        {" "}
        Events{" "}
      </Button> */}
      <Divider />
      {/* {self != undefined && stringFy(self)} <br /> */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "1rem",
        }}
      >
        {events.length != 0 && (
          <Stack
            spacing={2}
            /*useFlexGap={true} display={"flex"}*/ alignItems="center"
            justifyContent="center"
          >
           
          {events .sort(
          ((a: DCREventDTO, b: DCREventDTO) =>{ 
            if (a.timestamp < b.timestamp) return -1;
            if (a.timestamp > b.timestamp) return 1;
            return 0;
          })).map((event: DCREventDTO) => {
                  return <Event key={event.id} event={event} targetPort={port} />;
                })}
          </Stack>
        )}
        {events.length == 0 && (
          <Typography
            variant="h6"
            component="div"
            align="center"
            color="text.secondary"
          >
            No events available.
          </Typography>
        )}
        <br></br>
      </div>
      <Snackbar
        open={readyState !== ReadyState.OPEN}
        // autoHideDuration={10000}
      >
        <Alert severity={"error"} variant="standard" sx={{ width: "100%" }}>
          Connection to server lost. Attempting to reconnect...
          <LinearProgress color="error" />
        </Alert>
      </Snackbar>
    </Card>
    </div>
  );
}

export default App;
