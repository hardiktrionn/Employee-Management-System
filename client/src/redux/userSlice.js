import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "@/utils/axios";
import toast from "react-hot-toast";

const initialState = {
  user: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(checkAuth.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(checkAuth.fulfilled, (state, action) => {
      state.isLoading = false;
      state.user = action.payload.user;
    });
    builder.addCase(checkAuth.rejected, (state, action) => {
      state.user = null;
      state.isLoading = false;
      state.error = action.payload;
    });
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(loginUser.fulfilled, (state,action) => {
      state.isLoading = false;
      state.user=action.payload.user
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;

      if (action?.payload?.server) {
        toast.error(action.payload.server);
      }
    });
    builder.addCase(registerUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(registerUser.fulfilled, (state,action) => {
      state.isLoading = false;
      state.user=action.payload.user
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;

      if (action?.payload?.server) {
        toast.error(action.payload.server);
      }
    });
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        
        state.user = action.payload.user;
        toast.success("Profile updated successfully");
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;

        if (action?.payload?.server) {
          toast.error(action.payload.server);
        }
      });
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        toast.success("Logout");
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;

        if (action?.payload?.server) {
          toast.error(action.payload.server);
        }
      });
  },
});

export const checkAuth = createAsyncThunk(
  "user/checkAuth",
  async (_, thunkAPI) => {
    try {
      let res = await axiosInstance.get("/auth");

      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Auth failed";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async (data, thunkAPI) => {
    try {
      const response = await axiosInstance.post("/auth/login", data);

      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Login failed";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/register",
  async (data, thunkAPI) => {
    try {
      let res = await axiosInstance.post("/auth/register", data);

      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Register failed";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "user/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        "/auth/update-profile",
        formData
      );
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message;
      return rejectWithValue(message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  "user/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/auth/logout");
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message;
      return rejectWithValue(message);
    }
  }
);

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
