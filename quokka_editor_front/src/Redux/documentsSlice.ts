import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DocumentState {
  title: string;
  content: string;
  id: string;
  selected: boolean;
  shared_role: string;
  shared_by_link: boolean;
}

interface DocumentsState {
  items: DocumentState[];
  pages: number;
  page: number;
  size: number;
}

const initialState: DocumentsState = {
  items: [],
  pages: 0,
  page: 1,
  size: 50,
};

export const documentsSlice = createSlice({
  name: "documents",
  initialState,
  reducers: {
    getDocuments: (state, action: PayloadAction<DocumentsState>) => {
      state.items = action.payload.items.map((document) => ({
        title: document.title,
        content: document.content,
        id: document.id,
        selected: false,
        shared_role: document.shared_role,
        shared_by_link: document.shared_by_link,
      }));
      state.pages = action.payload.pages;
      state.page = action.payload.page;
      state.size = action.payload.size;
    },
    setSelectedDocument: (state, action: PayloadAction<string>) => {
      state.items = state.items.map((document) => {
        if (document.id === action.payload) {
          return { ...document, selected: !document.selected };
        } else {
          return { ...document, selected: false };
        }
      });
    },
    deleteDocument: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (document) => document.id !== action.payload
      );
    },
    addDocument: (state, action: PayloadAction<DocumentState>) => {
      state.items = [...state.items, action.payload];
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
