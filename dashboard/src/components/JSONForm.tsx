import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { reconfiguration } from "../Store/users";
import { RowData } from "../Pages/MainPage";

export const JSONForm = (props: {
  open: boolean;
  handleClose: () => void;
  setCunrrentRow: (id: number | undefined) => void;
  currentRow: number | undefined;
  rows: RowData[];
  // handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) => {

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries((formData as any).entries());
    const choreo = formJson.choreo;
    const role = formJson.role;
    // console.log("Submitting json", JSON.parse(choreo));
    // console.log(JSON.parse(role) );
    var parsedChoreo = {
      "membershipDTO": JSON.parse(role),
      "endpointsDTO": JSON.parse(choreo)
    }

    if (props.currentRow !== undefined) {
      // console.log("Connecting with", parsedChoreo);
      const row = props.rows.find((r) => r.id === props.currentRow);
      if (row) {
        const userID = row.ip + ":" + row.port;
        reconfiguration(userID, JSON.stringify(parsedChoreo)).then((response) => {
          // console.log("Reconfiguration response", response);
        }).catch((error) => {
          console.error("Error in reconfiguration", error);
        });

      }
      props.setCunrrentRow(undefined);
    }
    props.handleClose();
  };
  return (
    <Dialog open={props.open} onClose={props.handleClose}>
      <DialogTitle>Data</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} id="choreo-form">
          <TextField
            autoFocus
            margin="dense"
            id="choreo"
            name="choreo"
            label="Choreography json"
            type="text"
            fullWidth
            variant="standard"
          />
          <TextField
            autoFocus
            margin="dense"
            id="role"
            name="role"
            label="Role JSON"
            type="text"
            fullWidth
            variant="standard"
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.handleClose}>Cancel</Button>
        <Button type="submit" form="choreo-form">
          Send
        </Button>
      </DialogActions>
    </Dialog>);
}
