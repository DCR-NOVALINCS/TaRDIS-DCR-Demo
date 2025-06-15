import React, { useEffect, useState } from 'react';
import Event from './components/Event';
import { StringTypeDTO, RelationDTO, RelationType,SelfDTO, ValueDTO, GraphDTO, DCREventDTO, KindDTO, KindDTOMap } from "./types/graph";
import Relation from './components/Relation';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { Alert, Button, Box, Snackbar, Stack, Typography, Divider, CircularProgress, LinearProgress } from '@mui/material';
import logo from './logo.png';
import { executeEvent,getEvents } from './api/graph';

const url = window.location.hostname;

const Toggle = ({ children }: { children: React.ReactNode }) => {

    const [open, setOpen] = useState(false);

    return <>
        {open && <Button onClick={() => setOpen(false)}>-</Button>}
        {open && children}
        {!open && <Button onClick={() => setOpen(true)}>+</Button>}
    </>
}

const Header = () => <><Typography variant="h4"> <img width={200} src={logo} /><div>DCR Choreography Viewer</div>  </Typography></>

const commonStyles = {
    bgcolor: 'background.paper',
    borderColor: 'text.primary',
    m: 1,
    border: 3,
    // width: '100%',
    padding: '16px',
};

function App() {

    const [port, setPort] = useState<number>(1234);
    const [self, selfSet] = useState<SelfDTO | undefined>(undefined);

    let { lastMessage: lastEventMessage, readyState } = useWebSocket(`ws://${url}:${port}/dcr`, {
        onOpen: () => { console.log("opened connection")},
        onClose: () => console.log("closed connection"),
        onMessage: (msg) => {
            // console.log("Received message", msg);
            var message = JSON.parse(msg.data);
            console.log(message);
            selfSet(message.self || undefined);
            setEvents(message.events || []);
        },
        shouldReconnect: () => true,
        onError: (e) => {
            console.error(e)
            setEvents([]);
        }
    });

    let [events, setEvents] = React.useState<DCREventDTO[]>(lastEventMessage ? JSON.parse(lastEventMessage.data) : []);

    let stringFy = (self: SelfDTO): string => {
        let params = self.params;
        // map((param) => `${param.name}: ${param.value}`);
        let paramsString = Object.entries(params).map(([key, value]) => `${key}: ${value.value}`).join(", ");
        return `${self.role}(${paramsString})`;
        // return self.role +  
    }
    // useEffect(() => {
    //     // events.filter((event) => event.kind == KindDTO.COMPUTATION && !event.marking.executed)
    //     // .forEach(
    //     //     (event) => {
    //     //         console.log(event)
    //     //         executeEvent(`http://localhost:${port}/computation-action-events/${event.id}`, {type: "Unit", value: ""})
    //     //         .then((data) => {
    //     //             // console.log(data);
    //     //            setEvents([...events]);
    //     //         })
    //     //         .catch((error) => {
    //     //             console.error(error);
    //     //         });
    //     //     }
    //     )

    // },[events]);
    return <Box sx={{ ...commonStyles, borderRadius: '16px' }}>
        <div>
            <Header />
            <Toggle>
                Port: <input type="text" value={port} onChange={(e) => setPort(parseInt(e.target.value) || 0)} />
                {/* IP: <input value={ip} onChange={(e) => setIp(e.target.value)} /> */}
            </Toggle>
            <Button variant="outlined" onClick= { () => {
                getEvents(`http://${url}:${port}/rest/dcr/events/enable`)
                .catch((error) => {
                    console.error(error);
                    setEvents([]);
                });
            }
        }> Events </Button>
            <Divider />
             {self != undefined && stringFy(self)} <br />
            <div style={{ justifyItems: "center", justifyContent: 'center', alignContent: 'center' }}>
                <br></br>
                {(events.length != 0) &&
                    <Stack spacing={2} /*useFlexGap={true} display={"flex"}*/ alignItems="center" justifyContent={"center"}>
                        {
                            events.map((event: DCREventDTO) => {
                                return <Event key={event.id} event={event} targetPort={port} />
                            })
                        }
                    </Stack>}
                {(events.length == 0) &&
                    <Typography variant="h6" component="div">
                        No events available.
                    </Typography>
                }
                <br></br>
            </div>
            <Snackbar
                open={readyState !== ReadyState.OPEN}
            // autoHideDuration={10000}
            >
                <Alert
                    severity={"error"}
                    variant="standard"
                    sx={{ width: '100%' }}
                >
                    Connection to server lost. Attempting to reconnect...
                    <LinearProgress color='error' />
                </Alert>
            </Snackbar>
        </div>
    </Box>

}

export default App;
