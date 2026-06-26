import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchApplications = createAsyncThunk('applications/fetchApplications', async (params: any = {}, thunkAPI) => {
  try {
    const response = await api.get('/api/applications', { params });
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch applications');
  }
});

export const updateApplicationStatus = createAsyncThunk('applications/updateStatus', async ({ id, status }: { id: number, status: string }, thunkAPI) => {
  try {
    const response = await api.put(`/api/applications/${id}/status`, { status });
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update application');
  }
});

const applicationSlice = createSlice({
  name: 'applications',
  initialState: {
    applications: [] as any[],
    total: 0,
    page: 1,
    totalPages: 1,
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchApplications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload.applications;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update
      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        const index = state.applications.findIndex(a => a.id === action.payload.id);
        if (index !== -1) {
          state.applications[index] = action.payload;
        }
      });
  }
});

export default applicationSlice.reducer;
