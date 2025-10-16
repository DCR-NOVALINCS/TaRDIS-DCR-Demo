import { Button, IconButton, Stack, TableCell, TableRow, TextField, Typography } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { DCREventDTO, SelfDTO } from "../types/graph";
import Event from "./Event";
import { RowData } from "../Pages/MainPage";
import { useAppDispatch, useUserSelector } from "../Store/hooks";
import useWebSocket from "react-use-websocket";
import { addUser, connectUser, getEvents, stringFy, removeUser, ResponseDTO, setSelf, setUserIPPort } from "../Store/users";
import { useEffect, useState } from "react";
import { connect } from "http2";
import { Draggable } from "@hello-pangea/dnd";



export const UserEntry = (props: {
  row: RowData;
  rows: RowData[];
  setRows: React.Dispatch<React.SetStateAction<RowData[]>>;
  setCurrentRow: (id: number | undefined) => void;
  setOpen: (open: boolean) => void;
  index: number;
  // setIP : React.Dispatch<React.SetStateAction<string>>;
  // setPort : React.Dispatch<React.SetStateAction<number>>;
  // ip : string;
  // port : number;
}) => {
  const dispatch = useAppDispatch();
  // const ip = useUserSelector((state) => state.ip);
  // const port = useUserSelector((state) => state.port);
  // console.log("Rendering UserEntry for ", props.ip, props.port);
  const [port, setPort] = useState<number>(props.row.port);
  const [self, setLocalSelf] = useState<string>(props.row.self);
  const [ip, setIP] = useState<String>(props.row.ip);
  const [event, setEvent] = useState<DCREventDTO[]>([]);

  //before change state
  var userId = props.row.ip + ":" + props.row.port;
  var user = useUserSelector((state) => state.users.find(u => u.ip + ":" + u.port === userId));
  const userConnection = user != undefined ? user.connection : false;

  // var user = getState().usersStore.users[userId];
  const { sendMessage, lastMessage, readyState, getWebSocket } = useWebSocket(`ws://${userId}/dcr`, {
    onOpen: () => {
      // dispatch(useAddUser({ ip: props.row.ip, port: props.row.port }));
      console.log("WebSocket connection established for " + userId);
      if (!userConnection) {
        getEvents(`http://${userId}/rest/dcr/events/enabled`);
      }
      // console.log("opened connection to "+userId)
    }
    ,
    share: false
    , //Will attempt to reconnect on all close events, such as server shutting down
    shouldReconnect: (closeEvent) => true,

    onClose: () => { console.log("WebSocket connection closed for " + userId); }

  });

  useEffect(() => {
    if (readyState == WebSocket.OPEN) {
      if (!userConnection) {
        dispatch(connectUser({ userId: userId, connect: true }));
      }
    } else if (readyState == WebSocket.CLOSED) {
      // const userConnection = useUserSelector((state) => state.users[props.row.ip + ":" + props.row.port].connection);
      if (userConnection) {
        dispatch(removeUser(userId));
      }
    }
  }, [readyState]);

  useEffect(() => {
    setIP(props.row.ip);
  }, [props.row.ip])
  useEffect(() => {
    setPort(props.row.port);
  }, [props.row.port])

  useEffect(() => {
    if (lastMessage !== null) {
      var message = JSON.parse(lastMessage.data) as ResponseDTO;
      // console.log("Received message from ", message);

      setLocalSelf(stringFy(message.self));
      dispatch(setSelf({ userId: userId, events: message }));
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

  return (
    <Draggable key={props.row.ip + ":" + props.row.port} draggableId={props.row.ip + ":" + props.row.port} index={props.row.id}>
      {(provided, snapshot) => (
        <TableRow
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          sx={{
            backgroundColor: snapshot.isDragging ? 'action.hover' : 'inherit',
            cursor: 'grab',
          }}
          key={props.row.id}>
          {/* Disconnect Button column */}
          <TableCell>
            <IconButton
              // img= {"/disconnect_icon.png"}
              color="error"
              onClick={() => {
                var rowC = props.rows.find((r) => r.id === props.row.id);
                if (rowC) {
                  alert(`Disconnected ${rowC.self} with value: ${rowC.ip}:${rowC.port}`);
                  dispatch(removeUser(userId));
                  getWebSocket()?.close(1000, "Manual close");
                  props.setRows((prev) => prev.filter((r) => r.id !== props.row.id));
                }

              }}
            >
              <DeleteIcon />
            </IconButton>
          </TableCell>

          {/* TextField column */}
          <TableCell>
            {/* {props.row.ip} */}
            <TextField
              autoFocus
              value={ip}
              size="small"
              margin="dense"
              variant="standard"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>

                setIP(e.target.value)
              }
            />
          </TableCell>
          <TableCell>
            {/* {props.row.port} */}
            <TextField
              value={port}
              autoFocus
              defaultValue={0}
              // variant="standard"
              margin="dense"
              // type="number"
              size="small"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPort(Number.parseInt(e.target.value))
                // setRows((prev) =>
                //   prev.map((rowList) =>
                //     rowList.id === row.id ? { ...rowList, port: Number.parseInt(e.target.value)} : row
                //   )
                // )
              }
            />
          </TableCell>

          {/* Button column */}
          <TableCell>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                // handleUpdate(props.row.id)

                dispatch(connectUser({ userId: userId, connect: false }));
                dispatch(setUserIPPort({ userId: userId, ip: ip, port: port }));
              }
              }
            >
              Update IP/Port
            </Button>
          </TableCell>
          {/* Text column */}
          <TableCell>{self}</TableCell>

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
                    return <Event key={event.id} event={event} targetPort={props.row.port} targetIp={props.row.ip} />;
                  })}
              </Stack>
            )}

          </TableCell>
        </TableRow>
      )}
    </Draggable>
  );
};