import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DocumentState {
  title: string;
  content: string;
  id: string;
  selected: boolean;
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
      state.documents = action.payload.map((document) => ({
        title: document.title,
        content: document.content,
        id: document.id,
        selected: false,
      }));
    },
    setSelectedDocument: (state, action: PayloadAction<string>) => {
      state.documents = state.documents.map((document) => {
        if (document.id === action.payload) {
          return { ...document, selected: !document.selected };
        } else {
          return { ...document, selected: false };
        }
      });
    },
    deleteDocument: (state, action: PayloadAction<string>) => {
      state.documents = state.documents.filter(
        (document) => document.id !== action.payload
      );
    },
    addDocument: (state, action: PayloadAction<DocumentState>) => {
      state.documents = [...state.documents, action.payload];
    },
  },
});

export const {
  getDocuments,
  deleteDocument,
  addDocument,
  setSelectedDocument,
} = documentsSlice.actions;

export default documentsSlice.reducer;
