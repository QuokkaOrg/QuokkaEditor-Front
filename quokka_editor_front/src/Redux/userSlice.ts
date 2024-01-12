import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type UserState = {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
};

const initialState: UserState = {
  id: "",
  username: "",
  email: "",
  first_name: "",
  last_name: "",
  is_active: true,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.id = action.payload.id;
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.first_name = action.payload.first_name;
      state.last_name = action.payload.last_name;
      state.is_active = action.payload.is_active;
    },
    clearUser: (state) => {
      state.id = initialState.id;
      state.username = initialState.username;
      state.email = initialState.email;
      state.first_name = initialState.first_name;
      state.last_name = initialState.last_name;
      state.is_active = initialState.is_active;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
