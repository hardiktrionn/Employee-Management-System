import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "./userSlice";

interface AdminState {
  employee: User[];
  isFetchingEmployee: boolean;
  isDeletingEmployee: boolean;
  error: string | null;
}

const initialState: AdminState = {
  employee: [],
  isFetchingEmployee: false,
  isDeletingEmployee: false,
  error: null,
};



const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    setEmployee: (state, action: PayloadAction<User[] | []>) => {
      state.employee = action.payload
    }
  },

});

export const { setEmployee } = adminSlice.actions;
export default adminSlice.reducer;
