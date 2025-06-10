import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "./userSlice";

export interface Leave {
  employee: {
    name: string,
    profilePhoto: string,
    _id: string
    email:string
  };
  _id:string
  leaveType: 'personal' | 'sick' | 'vacation' | 'emergency';
  startDate: string;
  endDate: string;
  duration: number
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedAt: string;
  approvedAt?: string;
  rejectedReason?: string
}
interface AdminState {
  employee: User[];
  leave: Leave[];
  isFetchingEmployee: boolean;
  isDeletingEmployee: boolean;
  error: string | null;
}

const initialState: AdminState = {
  employee: [],
  leave: [],
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
    },
    setLeave: (state, action: PayloadAction<Leave[] | []>) => {
      state.leave = action.payload
    }
  },

});

export const { setEmployee, setLeave } = adminSlice.actions;
export default adminSlice.reducer;
