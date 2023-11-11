import { configureStore } from "@reduxjs/toolkit";
import documentsReducer from "./documentsSlice";
import clientsReducer from "./clientsSlice";

export const store = configureStore({
  reducer: { documents: documentsReducer, clients: clientsReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
