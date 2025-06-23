interface ValueDTO {
    type: string;
    value: any;
}
interface UnitDTO extends ValueDTO {
    type: "Unit";
    value: undefined;
}
interface BooleanDTO extends ValueDTO {
    type: "Boolean";
    value: boolean;
}
interface IntDTO extends ValueDTO {
    type: "Number";
    value: number;
}
interface StringDTO extends ValueDTO {
    type: "String";
    value: string;
}
interface RecordDTO extends ValueDTO {
    type: "Record";
    value: { [key: string]: ValueDTO }

}

interface TypeDTO { type: string }
interface UnitTypeDTO extends TypeDTO { }
interface BooleanTypeDTO extends TypeDTO { }
interface StringTypeDTO extends TypeDTO { }
interface IntTypeDTO extends TypeDTO { }
interface RefTypeDTO extends TypeDTO { } //TODO: Check this type

interface RecordTypeDTO extends TypeDTO {
    fields: { [key: string]: TypeDTO }
}

interface SelfDTO {
    role: string;
    params: { [key: string]: ValueDTO };

}

// interface EndpointDTO {

// }
interface DCREventDTO {
    id: string;
    label:string;
    action: string;
    kind: KindDTO;
    initiator: string;
    typeExpr: TypeDTO;
    marking: MarkingDTO;
    timestamp: number;
    receivers: UserSetValDTO;
}
interface UserSetValDTO {
    userVals : Array<RoleValDTO>;
}

interface RoleValDTO {
    role: string;
    constrainedParams : { [key: string]: ValueDTO };
    freeParams : Set<string>;
}
// interface InteractionEventDTO extends DCREventDTO {
//     receivers: UserSetValDTO;
// }
interface MarkingDTO {
    hasExecuted: boolean;
    isPending: boolean;
    isIncluded: boolean;
    value: ValueDTO;
}
interface RelationDTO {
    from: string;
    guard: ValueDTO;
    type: RelationType;
}

interface ControlRelationDTO extends RelationDTO {
    to: string;
}

interface SpawnRelationDTO extends RelationDTO {
    graph: GraphDTO;
}

export enum RelationType {
    INCLUDE = "include", EXCLUDE = "exclude", RESPONSE = "response", CONDITION = "condition", MILESTONE = "milestone"
}

// GraphDTO Interface
interface GraphDTO {
    events: Array<DCREventDTO>;
    relations: Array<RelationDTO>;
}

export enum KindDTO {
    COMPUTATION = "computation-action",
    INPUT_SEND = "input-send",
    RECEIVE = "receive",
    INPUT = "input-action",
    COMPUTATION_SEND =  "computation-send"


}

export const KindDTOMap: Record<string, KindDTO> = {
    "computation-action": KindDTO.COMPUTATION,
    "input-send": KindDTO.INPUT_SEND,
    "receive": KindDTO.RECEIVE,
    "input-action": KindDTO.INPUT,
    "computation-send": KindDTO.COMPUTATION_SEND
};

export type {
    ValueDTO, UnitDTO,
    BooleanDTO, IntDTO, StringDTO, RecordDTO,
    TypeDTO,
    UnitTypeDTO,
    BooleanTypeDTO,
    StringTypeDTO,
    IntTypeDTO,
    RefTypeDTO,
    RecordTypeDTO,
    DCREventDTO,
    UserSetValDTO,
    RoleValDTO,
    // InteractionEventDTO,
    MarkingDTO,
    RelationDTO,
    ControlRelationDTO,
    SpawnRelationDTO,
    GraphDTO,
    SelfDTO
}