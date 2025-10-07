import React from "react";
import { KindDTO } from "../types/graph";
import Chip from '@mui/material/Chip';



export default function EventChip({kind}:{kind: KindDTO}){

    const ChipEventType = () => {
        switch(kind) {
            case KindDTO.COMPUTATION: {
                return <Chip label="Computation" color="info" size="small"/>
            }
            case KindDTO.INPUT_SEND: {
                return <Chip label="Input Send" color="info" size="small"/>
            }
            case KindDTO.RECEIVE: {
                return <Chip label="Receive" color="info" size="small"/>
            }
            case KindDTO.INPUT: {
                return <Chip label="Input" color="info" size="small"/>
            }
            case KindDTO.COMPUTATION_SEND: {
                return <Chip label="Computation Send" color="info" size="small"/>
            }
            default: {
                return <Chip label="Unknown" color="error" size="small"/>
            }

        }
    }
    return (
        <div>
            <ChipEventType/>
        </div>
    )



    

    


}