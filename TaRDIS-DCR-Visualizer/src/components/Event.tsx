import React from "react";
import {
  DCREventDTO,
  TypeDTO,
  RecordTypeDTO,
  ValueDTO,
  KindDTO,
  RecordDTO,
  Kind,
} from "../types/graph";
import { Alert, Card, CardContent, Snackbar, Typography } from "@mui/material";
import { EventForm } from "./EventModal";
import { executeEvent } from "../services/graph";
import { SnackMessage } from "../types/snackbar";
import { SnackMessageFactory } from "../lib/snackbar";

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
  if (typeExpr.type !== "Record") {
    if (typeExpr.type === "Unit") {
      return { type: typeExpr.type, value: "" };
    } else {
      return { type: typeExpr.type, value: formData.get("Value") };
    }
  } else {
    let value: { [key: string]: ValueDTO } = {};
    let recordType = typeExpr as RecordTypeDTO;
    Object.entries(recordType.fields).forEach((entry) => {
      value[entry[0]] = { type: entry[1].type, value: formData.get(entry[0]) };
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

  const executeInput = (formEvent: React.FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    const formData = new FormData(formEvent.currentTarget);
    // const formJson = Object.fromEntries((formData as any).entries());

    const messageFactory = SnackMessageFactory.getInstance();

    let value = convertFormDataIntoValue(formData, event.typeExpr);
    executeEvent(
      `http://${url}:${targetPort}/${event.kind}-events/${event.id}`,
      value
    )
      .then((response) => {
        console.log(response);

        setSnackBarContent(
          response.ok
            ? messageFactory.success(
                <>
                  Event <b>{event.id}</b> executed successfully.
                </>
              )
            : messageFactory.error(
                <>
                  Error executing event <b>{event.id}</b>.
                </>
              )
        );

        setShowSnackbar(true);
      })
      .catch((error) => {
        console.error(error);
        setShowSnackbar(true);
        setSnackBarContent(
          messageFactory.error(
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

export default function Event({ event, targetPort }: EventProps) {
  return (
    <Card style={{ maxWidth: "20rem", width: "100%", alignContent: "center" }}>
      <CardContent style={{ alignSelf: "center" }}>
        {(event.kind === Kind.COMPUTATION ||
          event.kind === Kind.COMPUTATION_SEND) && (
          <ComputationEvent event={event} />
        )}
        {(event.kind === Kind.INPUT || event.kind === Kind.INPUT_SEND) && (
          <InputEvent event={event} targetPort={targetPort} />
        )}
      </CardContent>
    </Card>
  );
}
