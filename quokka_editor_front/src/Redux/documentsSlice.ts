import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import axios from "axios";
import { API_URL } from "../consts";

interface DocumentState {
  title: string;
  content: string;
  id: string;
}

interface DocumentsState {
  documents: DocumentState[];
}

const initialState: DocumentsState = {
  documents: [],
};

export const documentsSlice = createSlice({
  name: "documents",
  initialState,
  reducers: {
    getDocuments: (state, action: PayloadAction<DocumentState[]>) => {
      state.documents = action.payload;
    },
    deleteDocument: (state, action: PayloadAction<string>) => {
      state.documents = state.documents.filter(
        (document) => document.id !== action.payload
      );
    },
  },
});

export const { getDocuments, deleteDocument } = documentsSlice.actions;

export default documentsSlice.reducer;
