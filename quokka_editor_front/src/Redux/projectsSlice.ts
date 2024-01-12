import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ProjectState {
  id: string;
  user_id: string;
  title: string;
  selected: boolean;
  shared_role: string;
  shared_by_link: boolean;
  images: unknown;
}

export interface ProjectsState {
  items: ProjectState[];
  total: number;
  pages: number;
  page: number;
  size: number;
}

const initialState: ProjectsState = {
  items: [],
  total: 0,
  pages: 0,
  page: 1,
  size: 14,
};

export const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    getProjects: (state, action: PayloadAction<ProjectsState>) => {
      state.items = action.payload.items.map((project) => ({
        id: project.id,
        user_id: project.user_id,
        title: project.title,
        selected: false,
        images: project.images,
        shared_role: "READ",
        shared_by_link: false,
      }));
      state.total = action.payload.total;
      state.pages = action.payload.pages;
      state.page = action.payload.page;
      state.size = action.payload.size;
    },
    setSelectedProject: (state, action: PayloadAction<string>) => {
      state.items = state.items.map((project) => {
        if (project.id === action.payload) {
          return { ...project, selected: !project.selected };
        } else {
          return { ...project, selected: false };
        }
      });
    },
    deleteProject: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (project) => project.id !== action.payload
      );
    },
    addProject: (state, action: PayloadAction<ProjectState>) => {
      state.items = [...state.items, action.payload];
    },
    clearProjects: (state) => {
      state.items = initialState.items;
      state.total = initialState.total;
      state.page = initialState.page;
      state.pages = initialState.pages;
      state.size = initialState.size;
    },
  },
});

export const {
  getProjects,
  deleteProject,
  addProject,
  setSelectedProject,
  clearProjects,
} = projectsSlice.actions;

export default projectsSlice.reducer;
