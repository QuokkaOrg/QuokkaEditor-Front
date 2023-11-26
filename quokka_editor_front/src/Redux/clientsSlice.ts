import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CursorType } from "../types/ot";

export interface RemoteClient {
  username: string;
  user_token: string;
  ch: number;
  line: number;
  clientColor?: string;
}

export interface RemoteClients {
  clients: RemoteClient[] | null;
}

const initialState: RemoteClients = {
  clients: null,
};

const generateClientColor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

export const clientsSlice = createSlice({
  name: "remoteClients",
  initialState,
  reducers: {
    getRemoteClients: (state, action: PayloadAction<RemoteClient[]>) => {
      state.clients = action.payload;
    },
    addRemoteClient: (state, action: PayloadAction<RemoteClient>) => {
      if (!state.clients) state.clients = [{ ...action.payload }];
      else state.clients = [...state.clients, { ...action.payload }];
    },
    deleteRemoteClient: (state, action: PayloadAction<string>) => {
      if (!state.clients) return;
      state.clients = state.clients.filter(
        (client) => client.user_token !== action.payload
      );
    },
    updateRemoteClient: (state, action: PayloadAction<CursorType>) => {
      if (!state.clients) return;
      state.clients = state.clients.map((client) => {
        if (client.user_token === action.payload.user_token) {
          return {
            ...client,
            ch: action.payload.ch,
            line: action.payload.line,
          };
        } else return client;
      });
    },
  },
});

export const {
  addRemoteClient,
  deleteRemoteClient,
  updateRemoteClient,
  getRemoteClients,
} = clientsSlice.actions;
export default clientsSlice.reducer;
