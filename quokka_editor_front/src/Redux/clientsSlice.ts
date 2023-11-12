import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface RemoteClient {
  token: string;
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
    addRemoteClient: (state, action: PayloadAction<RemoteClient>) => {
      if (!state.clients)
        state.clients = [
          { ...action.payload, clientColor: generateClientColor() },
        ];
      else
        state.clients = [
          ...state.clients,
          { ...action.payload, clientColor: generateClientColor() },
        ];
    },
    deleteRemoteClient: (state, action: PayloadAction<string>) => {
      if (!state.clients) return;
      state.clients = state.clients.filter(
        (client) => client.token !== action.payload
      );
    },
    updateRemoteClient: (state, action: PayloadAction<RemoteClient>) => {
      if (!state.clients) return;
      state.clients = state.clients.map((client) => {
        if (client.token === action.payload.token)
          return { ...action.payload, clientColor: client.clientColor };
        else return client;
      });
    },
  },
});

export const { addRemoteClient, deleteRemoteClient, updateRemoteClient } =
  clientsSlice.actions;
export default clientsSlice.reducer;
