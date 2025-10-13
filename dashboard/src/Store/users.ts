import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { DCREventDTO, SelfDTO, ValueDTO } from "../types/graph";
import { AppDispatch, State as RootState } from "./index";
import useWebSocket from "react-use-websocket";



export interface UserState {
    // id: number,
    self: SelfDTO | undefined,
    ip: String,
    port: number,
    // events: DCREventDTO[],
    // loading: boolean,
    // uploading: boolean,
    // connection: WebSocket | undefined
}

export interface State {
    users: Record<string,UserState>;
    userFilter: SelfDTO | undefined;
    ip: String,
    port: number,
    // size: number
}
// const initialState: State = {
//     self: undefined,
//     ip: "localhost",
//     port: 1234, 
//     events: [],
//     loading: false,
//     uploading: false
// }
const initialState: State = {
    users: {},
    userFilter: undefined,
    ip: "localhost",
    port: 1234,
    // size:0
}

export interface ResponseDTO{
    self: SelfDTO;
    events: DCREventDTO[];
}

export const slice = createSlice({
    name:"users",
    initialState,
    reducers: {
        // connect: (state, action: PayloadAction<{ userId: string; socket: WebSocket }>) => {
        //   state.users[action.payload.userId].connection = action.payload.socket;
        // },
        setIP : (state, action: PayloadAction<String>) => {
          state.ip = action.payload;
        },
        setPort : (state, action: PayloadAction<number>) => {
          state.port = action.payload;
        },
        setEvents: (state, action: PayloadAction<{userId:string, events:ResponseDTO}>) => {
          // console.log("Setting events for ", stringFy(action.payload.events.self));
          // console.log(action.payload.events);
          state.users[action.payload.userId].self = action.payload.events.self;
          // state.users[action.payload.userId].events = action.payload.events.events;
        }, 
        // disconnect: (state, action: PayloadAction<string>) => {
        //   state.users[action.payload].connection?.close();
        //   delete state.users[action.payload];
        // },
        // reconfigure: (state, action) => {
          // state.
          // state.size++;
        // },
        addUser: (state, action: PayloadAction<{ip: String, port: number}>) => {
          var userId = action.payload.ip+":"+action.payload.port; 
          if (!(userId in state.users)) {
            state.users[userId] = {
              self: undefined,
              ip: action.payload.ip,
              port: action.payload.port,
              // events: [],
              // connection: undefined
            }
            // state.size++;
          }
        }
    }
})

export const {setEvents,setIP, setPort, addUser} = slice.actions

export default slice.reducer


export async function reconfiguration(userIP: string, json: string) {
  console.log("Reconfiguring ", userIP, json);
  return await fetch(`http://${userIP}/rest/dcr/reconfiguration`, { // Added URL construction
    method: 'PUT', // or 'PUT',
    mode: 'cors', // Add this line to enable CORS
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: json
  })
    // .then((response) => response.json())
    .then((data) => {
      console.log('Success:', data.text());
      return data;
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}
export async function executeEvent(url: string, value:any) {
  console.log("Executing event ", url, value);
  return await fetch(url, {
    method: 'PUT', // or 'PUT',
    mode: 'cors', // Add this line to enable CORS
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(value)
  })
    // .then((response) => response.json())
    .then((data) => {
      console.log('Success:', data.text());
    })
    .catch((error) => {
    console.error('Error:', error);
  });
}

export async function getEvents(url: string) {
  return await fetch(url, {
    method: 'GET',
    mode: 'no-cors', // Add this line to enable CORS
     })
}

export const stringFy = (self: SelfDTO): string => {
  let params = self.params;
  // map((param) => `${param.name}: ${param.value}`);
  let paramsString = Object.entries(params)
    .map(([key, value]) => `${key}: ${value.value}`)
    .join(", ");
  return `${self.role}(${paramsString})`;
};



