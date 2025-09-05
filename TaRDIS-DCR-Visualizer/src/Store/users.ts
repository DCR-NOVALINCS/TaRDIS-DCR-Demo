import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { DCREventDTO, SelfDTO, ValueDTO } from "../types/graph";
import { AppDispatch, State as RootState } from "./index";
import useWebSocket from "react-use-websocket";



 interface UserState {
    self: SelfDTO | undefined,
    ip: String,
    port: number,
    events: DCREventDTO[],
    // loading: boolean,
    // uploading: boolean,
    connection: WebSocket | undefined
}

export interface State {
    users: Record<string,UserState>;
    userFilter: SelfDTO | undefined;
    ip: String,
    port: number,
    size: number
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
    size:0
}

interface ResponseDTO{
    self: SelfDTO;
    events: DCREventDTO[];
}

export const slice = createSlice({
    name:"users",
    initialState,
    reducers: {
        connect: (state, action: PayloadAction<{ userId: string; socket: WebSocket }>) => {
          state.users[action.payload.userId].connection = action.payload.socket;
        },

        setEvents: (state, action: PayloadAction<{userId:string, events:ResponseDTO}>) => {
            state.users[action.payload.userId].self = action.payload.events.self;
            state.users[action.payload.userId].events = action.payload.events.events;
        }, 
        disconnect: (state, action: PayloadAction<string>) => {
          delete state.users[action.payload].connection;
          state.size--;
        },
        setUserSize: (state) => {
          state.size++;
        }
    }
})

export const {setEvents ,connect, disconnect} = slice.actions

export default slice.reducer


//missing adding events
export const connectUser = (ip: String, port: number) => (dispatch: AppDispatch,  getState: () => RootState) => {
  var userId = ip+":"+port;  
  var user = getState().usersStore.users[userId];
  if (user === undefined) {
    const ws = new WebSocket(`ws://${userId}/dcr`);
    ws.onopen = () => {
      console.log("opened connection to "+userId);
    }
    ws.onclose = () => console.log("closed connection to "+userId);
    ws.onmessage = (msg) => {
      var message = JSON.parse(msg.data) as ResponseDTO;
      console.log("Received message from "+userId, message);
      dispatch(setEvents({userId,events:message}));
    };
    ws.onerror = (e) => {
      console.error("WebSocket error for "+userId, e);

    };
    dispatch(connect({ userId, socket: ws }));
  }
 
  };
 export const disconnectUser = (userId: string) => (dispatch: AppDispatch, getState: () => RootState) => {
    const sockets = getState().usersStore.users;
    const socket = sockets[userId].connection;
    if (socket) {
      socket.close();
      dispatch(disconnect(userId));
    }
}

export async function executeEvent(url: string, value:any) {
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
    // .then((data) => {
    //   console.log('Success:', data);
    // })
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

