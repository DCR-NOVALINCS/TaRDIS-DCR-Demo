import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
// import { connectUser, setIP, setPort } from "../Store/users";
import { useAppDispatch } from "../Store/hooks";
import { RowData } from "../Pages/MainPage";




export const UserConnectForm = (props : {
  open: boolean;
  handleClose: () => void;
  rows: RowData[];
  setIP : React.Dispatch<React.SetStateAction<string>>;
  setPort : React.Dispatch<React.SetStateAction<number>>;
  setRows: React.Dispatch<React.SetStateAction<RowData[]>>;
  // handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) => {
    // const dispatch = useAppDispatch();
    const { open, handleClose, setIP, setPort } = props;

    // const closeForm = (ip:String, port: number) => {
    //   handleClose();
      
    // }
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const ip = formData.get("IP")?.toString() || "localhost";
        const port = parseInt(formData.get("port")?.toString() || "1234");
        // console.log("Connecting to ", ip, port);  
        setIP(ip);
        setPort(port);
        const newId = props.rows.length > 0 ? Math.max(...props.rows.map((r) => r.id)) + 1 : 1;
        props.setRows((prev) =>
          // if (prev.filter((r) => r.ip !== ip || r.port !== port)).length === 0); 
        [...prev, { id: newId, ip: ip, port: port, self: "Unknown", events: [] }]);
        // closeForm(ip, port);
        handleClose();
    }
    return ( <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Connect User</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit} id="connect-form">
            <TextField
              autoFocus
              margin="dense"
              id="ip"
              name="IP"
              label="IP"
              type="text"
              fullWidth
              variant="standard"
            />
             <TextField
              autoFocus
              margin="dense"
              id="port"
              name="port"
              label="Port"
              type="number"
              fullWidth
              variant="standard"
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" form="connect-form">
            Connect
          </Button>
        </DialogActions>
      </Dialog> );}