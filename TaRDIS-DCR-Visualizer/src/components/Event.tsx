
import React from 'react';
import { DCREventDTO, TypeDTO, UnitTypeDTO, BooleanTypeDTO, RecordTypeDTO, ValueDTO, KindDTO, RecordDTO } from "../types/graph";
import { Alert, Button, Card, CardContent, Snackbar, Typography } from '@mui/material';
import EventModal, { EventForm } from './EventModal';
import EventChip from './EventChip';
import { executeEvent } from '../api/graph';
import { errorMessage, SnackMessage, successMessage } from '../api/snackbar';

const url = window.location.hostname; //FIXME: This should not be here

type EventProps = {
    event: DCREventDTO,
    targetPort: number
    // targetIp: string
}

const convertFormDataIntoValue = (formData: FormData, typeExpr:TypeDTO): ValueDTO => {
    console.log("Converting form data into value", typeExpr);
    if (typeExpr.type !== "Record") {
        if ( typeExpr.type === "Unit"){
            return { type: typeExpr.type, value: "" };
        }else {
            return { type: typeExpr.type, value: formData.get("Value") };
        }
    } else {
        let value: { [key: string]: ValueDTO } = {}
        let recordType = typeExpr as RecordTypeDTO;
        let converter = (input:any) => {
            if (input === null || input === undefined) {
                return  "" ;
            } else if (input === "true" || input === "false") {
                return  input === "true" ;
            } else if (!isNaN(Number(input))) {
                return  Number(input) ;
            } else {
                return input.toString() };
        }
        // console.log("Converting form data into value for record type", recordType);
        Object.entries(recordType.fields).forEach((entry) => {
            value[entry[0]] = { type: entry[1].type, value: converter(formData.get(entry[0])) };
        });

        return { type: "Record", value: value };
    }
}

const printValue = (type: ValueDTO): string => {
    if (type.type === "Record") {
        let recordType = type as RecordDTO;
        let fields = [...[recordType.value]];
        let fieldsString = fields.map((field) => {
            return Object.entries(field).map(([key, value]) => {
                return `${key} : ${printValue(value)}`;
            });
        }).join(", ");
        return `{ ${fieldsString} }`;
    } else {
        return type.type === "Unit" ? "_" : type.value.toString();
    }
}

const ComputationEvent = ({ event }: { event: DCREventDTO }) =>
    <Typography variant="h5" component="div">
        {event.action} : {printValue(event.marking.value)}
    </Typography>

const InputEvent = ({ event, targetPort }: { event: DCREventDTO, targetPort: number }) => {
    const [showSnackbar, setShowSnackbar] = React.useState<boolean>(false);

    const [snackBarContent, setSnackBarContent] = React.useState<SnackMessage | undefined>(undefined);

    // console.log("InputEvent", event);
    const executeInput = (formEvent: React.FormEvent<HTMLFormElement>) => {
        formEvent.preventDefault();
        const formData = new FormData(formEvent.currentTarget);
        // const formJson = Object.fromEntries((formData as any).entries());

        let value = convertFormDataIntoValue(formData, event.typeExpr);
        let body ={eventID: event.id, value: value} ;
        // console.log(body);
        executeEvent(`http://${url}:${targetPort}/rest/dcr/events/${event.action}/${event.id}`, body)
        // .then((response) => {
        //     console.log("response ", response);

        //     setSnackBarContent(response.ok ?
        //         successMessage(<>
        //             Event <b>{event.id}</b> executed successfully.
        //         </>)
        //         : errorMessage(<>
        //             Error executing event <b>{event.id}</b>.
        //         </>));

        //     setShowSnackbar(true);
        // })
        .catch((error) => {
            console.error(error);
            setShowSnackbar(true);
            setSnackBarContent(errorMessage(<>
                Error executing event <b>{event.id}</b>.
            </>));
        });
    }

    return <div style={{ alignContent: "center" }}>

        <EventForm event={event} executeInput={executeInput} />
        <Snackbar
            open={showSnackbar}
            onClose={() => setShowSnackbar(false)}
            key={event.id}
            autoHideDuration={4000}
        >
            {snackBarContent &&
                <Alert
                    onClose={() => setShowSnackbar(false)}
                    severity={snackBarContent.type}
                    variant="standard"
                    sx={{ width: '100%' }}
                >
                    {snackBarContent.message}
                </Alert>}
        </Snackbar>
    </div>
}

export default function Event({ event, targetPort }: EventProps) {
    // console.log ( KindDTO[event.kind] === KindDTO.INPUT_SEND );
    return <Card style={{ maxWidth: "20rem", width: "100%",alignContent:"center"}} >
        
        <CardContent style={{alignSelf:"center"}}>
            {(event.kind === KindDTO.COMPUTATION || event.kind === KindDTO.COMPUTATION_SEND) &&
                <ComputationEvent event={event} />}
            {(event.kind === KindDTO.INPUT || event.kind === KindDTO.INPUT_SEND) &&
                <InputEvent event={event} targetPort={targetPort} />}
        </CardContent>
    </Card>
}