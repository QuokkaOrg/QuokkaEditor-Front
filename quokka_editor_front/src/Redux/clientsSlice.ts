import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface RemoteClient {
  username: string;
  user_token: string;
  ch: number;
  line: number;
  clientColor: string;
}

export interface UpdateClientType {
  user_token: string;
  ch: number;
  line: number;
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
      state.clients = action.payload.map((client) => ({
        ...client,
        ch: 0,
        line: 0,
      }));
    },
    addRemoteClient: (state, action: PayloadAction<RemoteClient>) => {
      if (!state.clients)
        state.clients = [{ ...action.payload, ch: 0, line: 0 }];
      else
        state.clients = [
          ...state.clients,
          { ...action.payload, ch: 0, line: 0 },
        ];
    },
    deleteRemoteClient: (state, action: PayloadAction<string>) => {
      if (!state.clients) return;
      state.clients = state.clients.filter(
        (client) => client.user_token !== action.payload
      );
    },
    updateRemoteClient: (state, action: PayloadAction<UpdateClientType>) => {
      if (!state.clients) return;
      state.clients = state.clients.map((client) => {
        if (client.user_token === action.payload.user_token)
          return {
            ...client,
            ch: action.payload.ch,
            line: action.payload.line,
          };
        else return client;
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
