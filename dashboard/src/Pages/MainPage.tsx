import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Typography,
  Container,
  Stack,
  Tab,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import { DCREventDTO, KindDTO } from "../types/graph";
import Event from "../components/Event";
import DeleteIcon from '@mui/icons-material/Delete';

interface RowData {
  id: number;
  ip:string;
  port:number;
  user: string;
  events: DCREventDTO[];
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
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
    const [rows, setRows] = useState<RowData[]>([
        { id: 1, ip:"localhost", port:1234, user: "Alice", events: [
          {
            id: "event1",
            label: "Event_1",
            action: "Action_1",
            kind: KindDTO.INPUT_SEND,
            initiator: "Alice",
            typeExpr: { type: "Unit" },
            marking: {
              hasExecuted: false,
              isPending: true,
              isIncluded: true,
              value: { type: "Unit", value: undefined }
            },
            timestamp: 0,
            receivers: {
              userVals: []
            }
          },
          {
            id: "event1",
            label: "Event_1",
            action: "Action_1",
            kind: KindDTO.INPUT_SEND,
            initiator: "Alice",
            typeExpr: { type: "Unit" },
            marking: {
              hasExecuted: false,
              isPending: true,
              isIncluded: true,
              value: { type: "Unit", value: undefined }
            },
            timestamp: 0,
            receivers: {
              userVals: []
            }
          },
          // {
          //   id: "event1",
          //   label: "Event_1",
          //   action: "Action_1",
          //   kind: KindDTO.INPUT_SEND,
          //   initiator: "Alice",
          //   typeExpr: { type: "Number" },
          //   marking: {
          //     hasExecuted: false,
          //     isPending: true,
          //     isIncluded: true,
          //     value: { type: "Number", value: 1 }
          //   },
          //   timestamp: 0,
          //   receivers: {
          //     userVals: []
          //   }
          // },
          {
            id: "event1",
            label: "Event_1",
            action: "Action_1",
            kind: KindDTO.INPUT_SEND,
            initiator: "Alice",
            typeExpr: { type: "Unit" },
            marking: {
              hasExecuted: false,
              isPending: true,
              isIncluded: true,
              value: { type: "Unit", value: undefined }
            },
            timestamp: 0,
            receivers: {
              userVals: []
            }
          },
          {
            id: "event1",
            label: "Event_1",
            action: "Action_1",
            kind: KindDTO.INPUT_SEND,
            initiator: "Alice",
            typeExpr: { type: "Unit" },
            marking: {
              hasExecuted: false,
              isPending: true,
              isIncluded: true,
              value: { type: "Unit", value: undefined }
            },
            timestamp: 0,
            receivers: {
              userVals: []
            }
          },
          {
            id: "event1",
            label: "Event_1",
            action: "Action_1",
            kind: KindDTO.INPUT_SEND,
            initiator: "Alice",
            typeExpr: { type: "Unit" },
            marking: {
              hasExecuted: false,
              isPending: true,
              isIncluded: true,
              value: { type: "Unit", value: undefined }
            },
            timestamp: 0,
            receivers: {
              userVals: []
            }
          }
        ] },
        { id: 2, ip:"localhost", port:1235, user: "Ze", events:[] },
        // { id: 3, name: "Charlie", editableValue: "30" },
      ]);
    
      const handleChange = (id: number, newValue: string) => {
        setRows((prev) =>
          prev.map((row) =>
            row.id === id ? { ...row, editableValue: newValue } : row
          )
        );
      };
      
      
      const handleConnect = (id: number) => {
        const row = rows.find((r) => r.id === id);
        if (row) {
          // alert(`Saved ${row.user} with value: ${row.ip}:${row.port}`);
          setCurrentRow(id);
        handleClickOpen();
        }
      };
      const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries((formData as any).entries());
        const email = formJson.email;
        console.log(email);
        if (currentRow !== undefined) {
          setCurrentRow(undefined);
        }
        handleClose();
      };

    
    return ( <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Data</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit} id="subscription-form">
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              name="email"
              label="Email Address"
              type="email"
              fullWidth
              variant="standard"
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" form="subscription-form">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        
      </Typography>

      <TableContainer component={Paper}>
        <Button variant="contained" color="info" sx={{ m: 2 }}
          onClick={() => {
            const newId = rows.length > 0 ? Math.max(...rows.map(r => r.id)) + 1 : 1;
            setRows([...rows, { id: newId, ip: "localhost", port: 1234, user: "New User", events: [] }]);
          }}
        >
          Add Row
        </Button>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Disconnect</TableCell>
              <TableCell>IP (TextField)</TableCell>
              <TableCell>Port (TextField)</TableCell>
              <TableCell>Actions</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Events (Buttons)</TableCell>
            </TableRow>
          </TableHead>

          <TableBody  
          >
            {rows.map((row) => (
              <TableRow key={row.id}>
                  {/* Disconnect Button column */}
                <TableCell>
                  <IconButton
                  // img= {"/disconnect_icon.png"}
                    color="error"
                    onClick={() => {
                      setRows((prev) => prev.filter((r) => r.id !== row.id));
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>

                {/* TextField column */}
                <TableCell>
                  <TextField
                    value={row.ip}
                    size="small"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      handleChange(row.id, e.target.value)
                    }
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    value={row.port}
                    size="small"
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setRows((prev) =>
                          prev.map((rowList) =>
                            rowList.id === row.id ? { ...rowList, port: Number.parseInt(e.target.value)} : row
                          )
                        )
                    }
                  />
                </TableCell>
          
                {/* Button column */}
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleConnect(row.id)}
                  >
                    Connect
                  </Button>
                </TableCell>
                 {/* Text column */}
                 <TableCell>{row.user}</TableCell>

                  {/* Events column */}
                  <TableCell
          // sx={{ width: "50%", overflow: "auto" }}
          sx={{ maxWidth: 400, overflowX: "auto", p: 1 }}
                  >
                    {row.events.length === 0 ? (
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
                      
                      {row.events.sort(
                      ((a: DCREventDTO, b: DCREventDTO) =>{ 
                        if (a.timestamp < b.timestamp) return -1;
                        if (a.timestamp > b.timestamp) return 1;
                        return 0;
                      })).map((event: DCREventDTO) => {
                              return <Event key={event.id} event={event}  />;
                            })}
                      </Stack>
                    ) }

                  </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>

    </div>)
}


export default MainApp;