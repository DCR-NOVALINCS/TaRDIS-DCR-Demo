import { RelationDTO } from "../types/graph";
export default function Relation({ relation }: { relation: RelationDTO }) {


    return <li>
        <p>{relation.from}</p>
        <p>{relation.guard.value}</p>
        <p>{relation.type}</p>
    </li>
}