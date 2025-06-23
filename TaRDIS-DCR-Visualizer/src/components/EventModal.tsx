import { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Snackbar,
} from "@mui/material";
import {
  DCREventDTO,
  RecordTypeDTO,
  TypeDTO,
  UnitTypeDTO,
} from "../types/graph";
import React from "react";

type EventModalProps = {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  event: DCREventDTO;
  executeInput: (event: React.FormEvent<HTMLFormElement>) => void;
};

const BasicField = ({ name }: { name: string | undefined }): JSX.Element => (
  <TextField
    margin="dense"
    id={name ? name : "value"}
    name={name ? name : "value"}
    label={name ? name : "value"}
    type="text"
    fullWidth
    variant="standard"
  />
);

const Field = ({ name, type }: { name: string; type: any }): JSX.Element => {
  // console.log("Rendering field", name, type);
  if (type.type !== "Record") {
    if (type.type === "Unit") {
      return <div></div>;
    } else 
    return <BasicField name={name} />;
  } else {
    let recordType = type as RecordTypeDTO;

    return (
      <div>
        {Object.entries(recordType.fields).map((entry) => (
          <Field key={entry[0]} type={entry[1]} name={entry[0].toString()} />
        ))}
      </div>
    );
  }
};

const MyForm = ({ event }: { event: DCREventDTO }) => (
  <Field key="" type={event.typeExpr} name={"value"} />
);

export default function EventModal(props: EventModalProps) {
  const { isOpen, setOpen, event, executeInput } = props;

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            executeInput(event);
            handleClose();
          },
        }}
      >
        <DialogTitle id="alert-dialog-title">{event.id}</DialogTitle>
        <DialogContent>
          <MyForm event={event} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <Button type="submit" variant="contained" autoFocus>
            Execute
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export function EventForm({
  event,
  executeInput,
}: {
  event: DCREventDTO;
  executeInput: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Simple validation: require all fields to be non-empty (except Unit)
  const validate = (form: HTMLFormElement) => {
    const newErrors: { [key: string]: string } = {};
    const traverse = (type: any, prefix = "") => {
      if (type.type === "Record") {
        Object.entries(type.fields).forEach(([key, value]) => {
          traverse(value, prefix ? `${prefix}.${key}` : key);
        });
      } else if (type.type !== "Unit") {
        const name = prefix || "value";
        const input = form.elements.namedItem(name) as HTMLInputElement;
        if (!input || !input.value.trim()) {
          newErrors[name] = "This field is required";
        }
      }
    };
    traverse(event.typeExpr);
    return newErrors;
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const validationErrors = validate(form);
    // console.log("Validation errors:", validationErrors);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      executeInput(e);
    }
  };

  // Pass errors down to fields
  const BasicField = ({ name }: { name: string | undefined }): JSX.Element => (
    <TextField
      margin="dense"
      id={name ? name : "value"}
      name={name ? name : "value"}
      label={name ? name : "value"}
      type="text"
      fullWidth
      variant="standard"
      error={!!errors[name ? name : "value"]}
      helperText={errors[name ? name : "value"]}
    />
  );

  const Field = ({ name, type }: { name: string; type: any }): JSX.Element => {
    if (type.type !== "Record") {
      if (type.type === "Unit") {
        return <div></div>;
      } else return <BasicField name={name} />;
    } else {
      let recordType = type as RecordTypeDTO;
      return (
        <div>
          {Object.entries(recordType.fields).map((entry) => (
            <Field key={entry[0]} type={entry[1]} name={entry[0].toString()} />
          ))}
        </div>
      );
    }
  };

  const MyForm = ({ event }: { event: DCREventDTO }) => (
    <Field key="" type={event.typeExpr} name={"value"} />
  );

  return (
    <form onSubmit={onSubmit} noValidate>
      <Button variant="contained" type="submit" style={{ width: "100%" }}>
        {event.label}
      </Button>
      <MyForm event={event} />
    </form>
  );
}
