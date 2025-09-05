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
  Stack
} from "@mui/material";
import { DCREventDTO } from "../types/graph";
import Event from "../components/Event";

interface RowData {
  id: number;
  ip:string;
  port:number;
  user: string;
  events: DCREventDTO[];
}




function MainApp() {

    const [rows, setRows] = useState<RowData[]>([
        { id: 1, ip:"localhost", port:1234, user: "Alice", events: [] },
        // { id: 2, name: "Bob", editableValue: "20" },
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
          alert(`Saved ${row.user} with value: ${row.ip}:${row.port}`);
        }
      };
    
    return ( <div>
  
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>IP (TextField)</TableCell>
              <TableCell>Port (TextField)</TableCell>
              <TableCell>Actions (Buttons)</TableCell>
              <TableCell>User (Text)</TableCell>
              <TableCell>Events (Buttons)</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
          

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
                  <TableCell>
                    {row.events.length === 0 ? (
                      <Typography variant="body2" color="textSecondary">
                        No events
                        </Typography>
                        ) : (
                          <Stack
                        spacing={2}
                        /*useFlexGap={true} display={"flex"}*/ alignItems="center"
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