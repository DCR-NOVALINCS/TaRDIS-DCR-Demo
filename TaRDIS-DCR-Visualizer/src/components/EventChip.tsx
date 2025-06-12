import { Kind, KindDTO } from "../types/graph";
import Chip from "@mui/material/Chip";

export default function EventChip({ kind }: { kind: KindDTO }) {
  let label: string;
  switch (kind) {
    case Kind.COMPUTATION:
      label = "Computation";
      break;
    case Kind.INPUT_SEND:
      label = "Input Send";
      break;
    case Kind.RECEIVE:
      label = "Receive";
      break;
    case Kind.INPUT:
      label = "Input";
      break;
    case Kind.COMPUTATION_SEND:
      label = "Computation Send";
      break;
    default:
      label = "Unknown";
  }

  return (
    <Chip
      label={label}
      color={label === "Unknown" ? "error" : "info"}
      size="small"
    />
  );
}
