import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Interfaces
interface SocialMedia {
  linkedin: string;
  github: string;
  twitter: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  address: string;
  designation: string;
  contact: string;
  department: string;
  emergencyContact: string;
  employeeId: string;
  dob: string;
  profilePhoto: string;
  joiningDate: string;
  mfaEnabled: boolean;
  socialMedia: SocialMedia;
}

interface ErrorPayload {
  server?: string;
  name?: string;
  password?: string
  confirmPassword?: string
  email?: string;
  address?: string;
  designation?: string;
  contact?: string;
  department?: string;
  emergencyContact?: string;
  dob?: string;
  profilePhoto?: string;
  joiningDate?: string;
  payload?: object
  mfaEnabled?: boolean;
  socialMedia?: SocialMedia;
}

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: ErrorPayload | null;
}

const initialState: UserState = {
  user: null,
  isLoading: false,
  error: null,
};



// -------------------- Slice --------------------
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setError: (state, action: PayloadAction<ErrorPayload | null>) => {
      state.error = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    }
  },
});

// Export actions and reducer
export const { setUser, clearError, setError ,setLoading} = userSlice.actions;
export default userSlice.reducer;
