import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  
  Typography,
  Container,

  IconButton,

} from "@mui/material";
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { reconfiguration, reorderUsers, stringFy, UserState } from "../Store/users";
import { useAppDispatch, useUserSelector } from "../Store/hooks";
import AddIcon from '@mui/icons-material/Add';
import { UserConnectForm } from "../components/UserConnectForm";
import { JSONForm } from "../components/JSONForm";
import { UserEntry } from "../components/UserEntry";

export interface RowData {
  id: number;
  ip:String;
  port:number;
  self: string;
  connection: boolean;
  // events: DCREventDTO[];
}

const mapper = (users: Record<string,UserState>): RowData[] => {
  // console.log("Mapping users", users);
  var ret = Object.entries(users).map(([key, user], index) => {
    return {
      id: user.indexTable,
      ip: user.ip,
      port: user.port,
      self: user.self ? stringFy(user.self) : "Undefined",
      connection: user.connection,
      // events: user.events
    };
  });
  return ret;
}

function MainApp() {
  const [open, setOpen] = React.useState(false);
  const [currentRow, setCurrentRow] = React.useState<number| undefined>(undefined);
  const [openSetUpForm, setOpenSetUpForm] = React.useState(false);

  // const [IP, setIP] = React.useState("localhost");
  // const [port, setPort] = React.useState(1234);
  // const dispatch = useAppDispatch();

  const handleCloseSetUpForm = () => {
    setOpenSetUpForm(false);
  }
  const handleClose = () => {
    setOpen(false);
  };
  const dispatch = useAppDispatch();
    const users = useUserSelector((state) => state.users);
    const [rows, setRows] = useState<RowData[]>(mapper(users));
    React.useEffect(() => {
      setRows(mapper(users).sort((a, b) => a.id - b.id));
    }, [users]);
  

    const handleDragEnd = (result: DropResult) => {
      if (!result.destination) return;
      const { source, destination } = result;
      if (source.index !== destination.index) {
        dispatch(reorderUsers({ startIndex: source.index, endIndex: destination.index }));
      }
    };
    return ( <div>
    <UserConnectForm open={openSetUpForm} handleClose={handleCloseSetUpForm} rows={rows} setRows={setRows}/>
    <JSONForm open={open} handleClose={handleClose} currentRow={currentRow} setCunrrentRow={setCurrentRow} rows={rows} />
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
      </Typography>

      <TableContainer component={Paper}>
        <IconButton
        //  variant="contained" 
         color="info"
          sx={{ m: 2 }}
          onClick={() => {
            setOpenSetUpForm(true);
            // const newId = rows.length > 0 ? Math.max(...rows.map((r) => r.id)) + 1 : 1;
            // setRows((prev) => [...prev, { id: newId, ip: "localhost", port: 0, self: "Unknown", events: [] }]);
          } }
        >
          <AddIcon />
        </IconButton>
        <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="usersTable">
          {(provided) => (
        <Table {...provided.droppableProps} ref={provided.innerRef}>
          <TableHead>
            <TableRow>
              <TableCell>Disconnect</TableCell>
              <TableCell>IP </TableCell>
              <TableCell>Port </TableCell>
              <TableCell>Actions</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Events (Buttons)</TableCell>
            </TableRow>
          </TableHead>

          <TableBody  
          >
            {rows.map((row, index) => (
                <UserEntry row={row} rows={rows} 
                setRows={setRows} setCurrentRow={setCurrentRow} 
                setOpen={setOpen}
                index={index}
                //  ip={IP} port= {port}
                // setIP={setIP}
                // setPort={setPort}
                /> 
           
             ))}
               {provided.placeholder}
          </TableBody>
        </Table>
        )}
        </Droppable>
        </DragDropContext>
      </TableContainer>
    </Container>

    </div>)
}


export default MainApp;