export interface ValueDTO {
    type: string;
    value: any;
}
export interface UnitDTO extends ValueDTO {
    type: "Unit";
    value: undefined;
}
export interface BooleanDTO extends ValueDTO {
    type: "Boolean";
    value: boolean;
}
export interface IntDTO extends ValueDTO {
    type: "Integer";
    value: number;
}
export interface StringDTO extends ValueDTO {
    type: "String";
    value: string;
}
export interface RecordDTO extends ValueDTO {
    type: "Record";
    value: { [key: string]: ValueDTO }
}

export interface TypeDTO { type: string }
export interface UnitTypeDTO extends TypeDTO { }
export interface BooleanTypeDTO extends TypeDTO { }
export interface StringTypeDTO extends TypeDTO { }
export interface IntTypeDTO extends TypeDTO { }
export interface RefTypeDTO extends TypeDTO { } //TODO: Check this type

export interface RecordTypeDTO extends TypeDTO {
    fields: { [key: string]: TypeDTO }
}
export interface DCREventDTO {
    id: string;
    action: string;
    kind: KindDTO;
    initiator: string;
    typeExpr: TypeDTO;
    marking: MarkingDTO;
}
export interface InteractionEventDTO extends DCREventDTO {
    receivers: Iterable<string>;
}
export interface MarkingDTO {
    executed: boolean;
    pending: boolean;
    included: boolean;
    value: ValueDTO;
}
export interface RelationDTO {
    from: string;
    guard: ValueDTO;
    type: RelationType;
}

export interface ControlRelationDTO extends RelationDTO {
    to: string;
}

export interface SpawnRelationDTO extends RelationDTO {
    graph: GraphDTO;
}

export enum RelationType {
    INCLUDE = "include", EXCLUDE = "exclude", RESPONSE = "response", CONDITION = "condition", MILESTONE = "milestone"
}

export interface GraphDTO {
    events: Array<DCREventDTO>;
    relations: Array<RelationDTO>;
}

type KindEvent = "computation" | "input"
type TypeEvent = "send" | "action"
export type KindDTO = `${KindEvent}-${TypeEvent}` | "receive" | "input-action" | "computation-send";

export enum Kind {
    COMPUTATION = "computation-action",
    INPUT_SEND = "input-send",
    RECEIVE = "receive",
    INPUT = "input-action",
    COMPUTATION_SEND =  "computation-send"
}

// export const KindDTOMap: Record<string, KindDTO> = {
//     "computation-action": KindDTO.COMPUTATION,
//     "input-send": KindDTO.INPUT_SEND,
//     "receive": KindDTO.RECEIVE,
//     "input-action": KindDTO.INPUT,
//     "computation-send": KindDTO.COMPUTATION_SEND
// };