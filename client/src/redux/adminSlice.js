import axiosInstance from "@/utils/axios";

const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");

const initialState = {
  employee: [],
  isFetchingEmployee: false,
  isDeletingEmployee: false,
  error: null,
};
const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllEmplyoee.pending, (state) => {
      state.isFetchingEmployee = true;
    });
    builder.addCase(fetchAllEmplyoee.rejected, (state, action) => {
      state.error = action.payload;
      state.isFetchingEmployee = false;
    });
    builder.addCase(fetchAllEmplyoee.fulfilled, (state, action) => {
    
      state.employee = action.payload.data;
      state.isFetchingEmployee = false;
    });
    builder.addCase(deleteOneEmployee.pending, (state) => {
      state.isDeletingEmployee = true;
    });
    builder.addCase(deleteOneEmployee.rejected, (state, action) => {
      state.error = action.payload;
      state.isDeletingEmployee = false;
    });
    builder.addCase(deleteOneEmployee.fulfilled, (state, action) => {
      state.employee = state.employee.filter(
        (user) => user._id != action.payload.id
      );
      state.isDeletingEmployee = false;
    });
  },
});

// fetch All User
export const fetchAllEmplyoee = createAsyncThunk(
  "admin/emp/all",
  async (_, thunkAPI) => {
    try {
      let res = await axiosInstance.get("/employee");

      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Auth failed";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const deleteOneEmployee = createAsyncThunk(
  "admin/emp/deleteOne",
  async (id, thunkAPI) => {
    try {
      let res = await axiosInstance.delete(`/employee/${id}`);

      return res.data;
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Auth failed";
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export default adminSlice.reducer;
