import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Leave {
    _id: string;
    leaveType: 'personal' | 'sick' | 'vacation' | 'emergency';
    startDate: string;
    endDate: string;
    duration:number
    reason: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    appliedAt: string;
    approvedAt?: string;
    rejectedReason?: string
}

interface leaveState {
    leave: Leave[] ,
    isFetchingLeave: boolean,
    isDeletingLeave: boolean,
    error: null,
}

const initialState: leaveState = {
    leave: [],
    isFetchingLeave: false,
    isDeletingLeave: false,
    error: null,
};



const leaveSlice = createSlice({
    name: "leave",
    initialState,
    reducers: {
        setLeave: (state, action: PayloadAction<Leave[] | []>) => {
            state.leave = action.payload
        }
    },

});

export const { setLeave } = leaveSlice.actions;
export default leaveSlice.reducer;
