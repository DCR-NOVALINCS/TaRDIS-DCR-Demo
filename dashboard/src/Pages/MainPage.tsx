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
import { reconfiguration, stringFy, UserState } from "../Store/users";
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
  // events: DCREventDTO[];
}

const mapper = (users: Record<string,UserState>): RowData[] => {
  var ret = Object.entries(users).map(([key, user], index) => {
    return {
      id: index,
      ip: user.ip,
      port: user.port,
      self: user.self ? stringFy(user.self) : "Undefined",
      // events: user.events
    };
  });
  return ret;
}

// interface DCREventDTO {
//     id: string;
//     label:string;
//     action: string;
//     kind: KindDTO;
//     initiator: string;
//     typeExpr: TypeDTO;
//     marking: MarkingDTO;
//     timestamp: number;
//     receivers: UserSetValDTO;
// }

function MainApp() {
  const [open, setOpen] = React.useState(false);
  const [currentRow, setCurrentRow] = React.useState<number| undefined>(undefined);
  const [openSetUpForm, setOpenSetUpForm] = React.useState(false);

  const [IP, setIP] = React.useState("localhost");
  const [port, setPort] = React.useState(1234);
  // const dispatch = useAppDispatch();

  const handleCloseSetUpForm = () => {
    setOpenSetUpForm(false);
  }
  const handleClose = () => {
    setOpen(false);
  };
    // const [rows, setRows] = useState<RowData[]>([
    //     { id: 1, ip:"localhost", port:0, self: "Alice", events: [
    //       {
    //         id: "event1",
    //         label: "Event_1",
    //         action: "Action_1",
    //         kind: KindDTO.INPUT_SEND,
    //         initiator: "Alice",
    //         typeExpr: { type: "Unit" },
    //         marking: {
    //           hasExecuted: false,
    //           isPending: true,
    //           isIncluded: true,
    //           value: { type: "Unit", value: undefined }
    //         },
    //         timestamp: 0,
    //         receivers: {
    //           userVals: []
    //         }
    //       },
    //       {
    //         id: "event1",
    //         label: "Event_1",
    //         action: "Action_1",
    //         kind: KindDTO.INPUT_SEND,
    //         initiator: "Alice",
    //         typeExpr: { type: "Unit" },
    //         marking: {
    //           hasExecuted: false,
    //           isPending: true,
    //           isIncluded: true,
    //           value: { type: "Unit", value: undefined }
    //         },
    //         timestamp: 0,
    //         receivers: {
    //           userVals: []
    //         }
    //       },
    //       {
    //         id: "event1",
    //         label: "Event_1",
    //         action: "Action_1",
    //         kind: KindDTO.INPUT_SEND,
    //         initiator: "Alice",
    //         typeExpr: { type: "Unit" },
    //         marking: {
    //           hasExecuted: false,
    //           isPending: true,
    //           isIncluded: true,
    //           value: { type: "Unit", value: undefined }
    //         },
    //         timestamp: 0,
    //         receivers: {
    //           userVals: []
    //         }
    //       },
    //       {
    //         id: "event1",
    //         label: "Event_1",
    //         action: "Action_1",
    //         kind: KindDTO.INPUT_SEND,
    //         initiator: "Alice",
    //         typeExpr: { type: "Unit" },
    //         marking: {
    //           hasExecuted: false,
    //           isPending: true,
    //           isIncluded: true,
    //           value: { type: "Unit", value: undefined }
    //         },
    //         timestamp: 0,
    //         receivers: {
    //           userVals: []
    //         }
    //       },
    //       {
    //         id: "event1",
    //         label: "Event_1",
    //         action: "Action_1",
    //         kind: KindDTO.INPUT_SEND,
    //         initiator: "Alice",
    //         typeExpr: { type: "Unit" },
    //         marking: {
    //           hasExecuted: false,
    //           isPending: true,
    //           isIncluded: true,
    //           value: { type: "Unit", value: undefined }
    //         },
    //         timestamp: 0,
    //         receivers: {
    //           userVals: []
    //         }
    //       }
    //     ] },
    //     { id: 2, ip:"localhost", port:1235, self: "Ze", events:[] },
    //     // { id: 3, name: "Charlie", editableValue: "30" },
    //   ]);
    const users = useUserSelector((state) => state.users);
    const [rows, setRows] = useState<RowData[]>(mapper(users));
    React.useEffect(() => {
      setRows(mapper(users));
    }, [users]);
    //  useState<RowData[]>([]);

      // const handleChange = (id: number, newValue: string) => {
       
      // };
    // const ip = useUserSelector((state) => state.ip);
    // const port = useUserSelector((state) => state.port);
    // useEffect(() => {
      
    //   //  setRows(mapper(users));
    //    if (IP && port) {
     
    //    }
    //  }, [IP,port]);
    return ( <div>
    <UserConnectForm open={openSetUpForm} handleClose={handleCloseSetUpForm} rows={rows} setRows={setRows} setIP={setIP} setPort={setPort}/>
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
        <Table>
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
            {rows.map((row) => (
              <UserEntry row={row} rows={rows} 
              setRows={setRows} setCurrentRow={setCurrentRow} 
              setOpen={setOpen} ip={IP} port= {port}
              setIP={setIP}
              setPort={setPort}/> 
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>

    </div>)
}


export default MainApp;