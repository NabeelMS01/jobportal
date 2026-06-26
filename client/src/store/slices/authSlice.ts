import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const loginUser = createAsyncThunk('auth/login', async (credentials: any, thunkAPI) => {
  try {
    const response = await api.post('/api/auth/login', credentials);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
  try {
    await api.post('/api/auth/logout');
    return null;
  } catch (error) {
    return thunkAPI.rejectWithValue('Logout failed');
  }
});

export const checkAuth = createAsyncThunk('auth/check', async (_, thunkAPI) => {
  try {
    const response = await api.get('/api/auth/me');
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue('Not authenticated');
  }
});

const initialState = {
  user: null as any | null,
  token: null as string | null,
  loading: true, // true by default to handle initial checkAuth
  error: null as string | null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      })
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.user = null;
      });
  }
});

export default authSlice.reducer;
