import { Button, IconButton, Stack, TableCell, TableRow, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { DCREventDTO } from "../types/graph";
import Event from "./Event";
import { RowData } from "../Pages/MainPage";
import { useAppDispatch, useUserSelector } from "../Store/hooks";
import useWebSocket from "react-use-websocket";
import { addUser, reconfiguration, ResponseDTO, setEvents } from "../Store/users";
import { useEffect, useState } from "react";



export const UserEntry = (props: {
  row: RowData;
  rows: RowData[];
  setRows: React.Dispatch<React.SetStateAction<RowData[]>>;
  setCurrentRow: (id: number | undefined) => void;
  setOpen: (open: boolean) => void;
  setIP : React.Dispatch<React.SetStateAction<string>>;
  setPort : React.Dispatch<React.SetStateAction<number>>;
  ip : string;
  port : number;
}) => {
  const dispatch = useAppDispatch();
  // const ip = useUserSelector((state) => state.ip);
  // const port = useUserSelector((state) => state.port);
  // console.log("Rendering UserEntry for ", props.ip, props.port);
  const [event, setEvent]= useState<DCREventDTO[]>([]);
  var userId = props.ip + ":" + props.port;
  // var user = getState().usersStore.users[userId];
  const { sendMessage, lastMessage, readyState } = useWebSocket(`ws://${userId}/dcr`, {
    onOpen: () =>  {
      dispatch(addUser({ ip: props.ip, port: props.port }));
      console.log("opened connection to "+userId)
    }
,    //Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: (closeEvent) => true,
  });

  
  useEffect(() => {
    if (lastMessage !== null) {
      var message = JSON.parse(lastMessage.data) as ResponseDTO;
      // console.log("Received message from ", message);
      dispatch(setEvents({ userId: userId, events: message }));
      setEvent(message.events);
    }
  }, [lastMessage]);
  
  const handleUpdate = (id: number) => {
    const row = props.rows.find((r) => r.id === id);
    if (row) {
      // alert(`Saved ${row.user} with value: ${row.ip}:${row.port}`);
      props.setCurrentRow(id);
      // dispatch(addUser({ip: row.ip, port: row.port}));

      // dispatch(reconfiguration({ userId: row.ip + ":" + row.port }));
      handleClickOpen();
    }
  };
  const handleClickOpen = () => {
    props.setOpen(true);
  };

  return (<TableRow key={props.row.id}>
    {/* Disconnect Button column */}
    <TableCell>
      <IconButton
        // img= {"/disconnect_icon.png"}
        color="error"
        onClick={() => {
          var rowC = props.rows.find((r) => r.id === props.row.id);
          if (rowC) {
            alert(`Disconnected ${rowC.self} with value: ${rowC.ip}:${rowC.port}`);
          }
          // disconnectUser(row.ip+":"+row.port);
          props.setRows((prev) => prev.filter((r) => r.id !== props.row.id));
        }}
      >
        <DeleteIcon />
      </IconButton>
    </TableCell>

    {/* TextField column */}
    <TableCell>
    {props.row.ip}
      {/* <TextField
          value={row.ip}
          size="small"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setRows((prev) =>
              prev.map((rowList) =>
                row.id === rowList.id ? { ...rowList, ip: e.target.value } : row
              )
            )
          }
        /> */}
    </TableCell>
    <TableCell>
    {props.row.port}
      {/* <TextField
          value={row.port}
          defaultValue={0}
          size="small"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setRows((prev) =>
                prev.map((rowList) =>
                  rowList.id === row.id ? { ...rowList, port: Number.parseInt(e.target.value)} : row
                )
              )
          }
        /> */}
    </TableCell>

    {/* Button column */}
    <TableCell>
      <Button
        variant="contained"
        color="primary"
        onClick={() =>
          handleUpdate(props.row.id)
        }
      >
        Update Choreography
      </Button>
    </TableCell>
    {/* Text column */}
    <TableCell>{props.row.self}</TableCell>

    {/* Events column */}
    <TableCell
      // sx={{ width: "50%", overflow: "auto" }}
      sx={{ maxWidth: 400, overflowX: "auto", p: 1 }}
    >
      {event.length === 0 ? (
        <Typography variant="body2" color="textSecondary">
          No events
        </Typography>
      ) : (
        <Stack
          direction="row"
          spacing={2}
          sx={{
            minWidth: "max-content",
            alignItems: "stretch",
            maxWidth: 400,
            overflowX: "auto",
            p: 1,
            "&::-webkit-scrollbar": { height: 6 },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#ccc",
              borderRadius: 3,
            },
          }}

          // sx={{ overflowX: "auto", p: 2, width: '100%' }}
          // useFlexGap={true} 
          // display={"flex"}
          alignItems="center"
          justifyContent="center"
        >

          {event.sort(
            ((a: DCREventDTO, b: DCREventDTO) => {
              if (a.timestamp < b.timestamp) return -1;
              if (a.timestamp > b.timestamp) return 1;
              return 0;
            })).map((event: DCREventDTO) => {
              return <Event key={event.id} event={event} />;
            })}
        </Stack>
      )}

    </TableCell>
  </TableRow>);
};