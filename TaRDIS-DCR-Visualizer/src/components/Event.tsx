import React from "react";
import {
  DCREventDTO,
  TypeDTO,
  UnitTypeDTO,
  BooleanTypeDTO,
  RecordTypeDTO,
  ValueDTO,
  KindDTO,
  RecordDTO,
  RoleValDTO,
} from "../types/graph";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Snackbar,
  Typography,
} from "@mui/material";
import EventModal, { EventForm } from "./EventModal";
import EventChip from "./EventChip";
import { executeEvent } from "../api/graph";
import { errorMessage, SnackMessage, successMessage } from "../api/snackbar";

const url = window.location.hostname; //FIXME: This should not be here

type EventProps = {
  event: DCREventDTO;
  targetPort: number;
  // targetIp: string
};

const convertFormDataIntoValue = (
  formData: FormData,
  typeExpr: TypeDTO
): ValueDTO => {
  console.log("Converting form data into value for type", typeExpr);
  if (typeExpr.type !== "Record") {
    if (typeExpr.type === "Unit") {
      return { type: typeExpr.type, value: "" };
    } else {
      console.log(url);
      // console.log("Form data
      return { type: typeExpr.type, value: formData.get("Value") };
    }
  } else {
    let value: { [key: string]: ValueDTO } = {};
    let recordType = typeExpr as RecordTypeDTO;
    let converter = (input: any) => {
      if (input === null || input === undefined) {
        return "";
      } else if (input === "true" || input === "false") {
        return input === "true";
      } else if (!isNaN(Number(input))) {
        return Number(input);
      } else {
        return input.toString();
      }
    };
    // console.log("Converting form data into value for record type", recordType);
    Object.entries(recordType.fields).forEach((entry) => {
      value[entry[0]] = {
        type: entry[1].type,
        value: converter(formData.get(entry[0])),
      };
    });

    return { type: "Record", value: value };
  }
};

const printValue = (type: ValueDTO): string => {
  if (type.type === "Record") {
    let recordType = type as RecordDTO;
    let fields = [...[recordType.value]];
    let fieldsString = fields
      .map((field) => {
        return Object.entries(field).map(([key, value]) => {
          return `${key} : ${printValue(value)}`;
        });
      })
      .join(", ");
    return `{ ${fieldsString} }`;
  } else {
    return type.type === "Unit" ? "_" : type.value.toString();
  }
};

const ComputationEvent = ({ event }: { event: DCREventDTO }) => (
  <Typography variant="h5" component="div">
    {event.action} : {printValue(event.marking.value)}
  </Typography>
);

const InputEvent = ({
  event,
  targetPort,
}: {
  event: DCREventDTO;
  targetPort: number;
}) => {
  const [showSnackbar, setShowSnackbar] = React.useState<boolean>(false);

  const [snackBarContent, setSnackBarContent] = React.useState<
    SnackMessage | undefined
  >(undefined);

  // console.log("InputEvent", event);
  const executeInput = (formEvent: React.FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    const formData = new FormData(formEvent.currentTarget);
    // const formJson = Object.fromEntries((formData as any).entries());
    console.log("Form data", formData);
    let value = convertFormDataIntoValue(formData, event.typeExpr);
    let body = { eventID: event.id, value: value };
    console.log("Executing input event", body);
    executeEvent(
      `http://${url}:${targetPort}/rest/dcr/events/${event.action}/${event.id}`,
      body
    ).catch((error) => {
      console.error(error);
      setShowSnackbar(true);
      setSnackBarContent(
        errorMessage(
          <>
            Error executing event <b>{event.id}</b>.
          </>
        )
      );
    });
  };

  return (
    <div style={{ alignContent: "center" }}>
      <EventForm event={event} executeInput={executeInput} />
      <Snackbar
        open={showSnackbar}
        onClose={() => setShowSnackbar(false)}
        key={event.id}
        autoHideDuration={4000}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        {snackBarContent && (
          <Alert
            onClose={() => setShowSnackbar(false)}
            severity={snackBarContent.type}
            variant="standard"
            sx={{ width: "100%" }}
          >
            {snackBarContent.message}
          </Alert>
        )}
      </Snackbar>
    </div>
  );
};

const Receivers = ({event}: {event: DCREventDTO}) => {
  const stringFy = (value: RoleValDTO): string => {
    let params = value.constrainedParams;
    let string = Object.entries(params)
      .map(([key, val]) => `${key}: ${val.value}`).join(", ");
    let freePrams = value.freeParams;
    if (Array.of(freePrams).length != 0) {
      return  `${value.role}(${Array.from(freePrams).map((v) => `${v}= *,`).join(" ")}${string})`;
    }
    return `${value.role}(${string})`;
  }

  if (event.receivers.userVals.length === 0) {
    return <Typography variant="body2">No receivers</Typography>;
  }
  return (
    <div>
      {event.receivers.userVals.map((receiver, index) => (
        <div key={index}> 
          <Typography variant="body1">{stringFy(receiver)}</Typography>
        </div>
        ))
      }
    </div>
  );
}
export default function Event({ event, targetPort }: EventProps) {
  // console.log ( KindDTO[event.kind] === KindDTO.INPUT_SEND );
  return (
    <Card
      variant= {event.marking.pending ? "elevation" : "outlined"}

      style={{
        // maxWidth: "20rem",
        // borderRadius: "1rem",
        backgroundColor: event.marking.pending ? "#fbeaea": "#ffffff" ,
        borderColor: event.marking.pending ?  "#fb1313": undefined,
        width: "100%",
        alignContent: "center",
      }}
    >
     
      <CardContent style={{ alignSelf: "center" }}>
      <Receivers event={event}></Receivers>
        {(event.kind === KindDTO.COMPUTATION ||
          event.kind === KindDTO.COMPUTATION_SEND) && (
          <ComputationEvent event={event} />
        )}
        {(event.kind === KindDTO.INPUT ||
          event.kind === KindDTO.INPUT_SEND) && (
          <InputEvent event={event} targetPort={targetPort} />
        )}
      </CardContent>
    </Card>
  );
}
