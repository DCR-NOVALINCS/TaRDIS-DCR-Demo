import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { DCREventDTO, RecordTypeDTO, TypeDTO } from "../types/graph";

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
    label={name ? name : "Value"}
    type="text"
    fullWidth
    variant="standard"
  />
);

const Field = ({
  name,
  type,
}: {
  name: string;
  type: TypeDTO;
}): JSX.Element => {
  if (type.type !== "Record") {
    if (type.type === "Unit") {
      return <div></div>;
    } else return <BasicField name={name} />;
  } else {
    let recordType = type as RecordTypeDTO;

    return (
      <div>
        {Object.entries(recordType.fields).map((entry) => (
          <Field type={entry[1]} name={entry[0].toString()} />
        ))}
      </div>
    );
  }
};

const MyForm = ({ event }: { event: DCREventDTO }) => (
  <Field key="" type={event.typeExpr} name={"Value"} />
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
        <DialogTitle id="alert-dialog-title">{"Input"}</DialogTitle>
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
  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    executeInput(event);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <Button variant="contained" type="submit" style={{ width: "100%" }}>
          {event.action}
        </Button>
        <MyForm event={event} />
      </form>
    </div>
  );
}
