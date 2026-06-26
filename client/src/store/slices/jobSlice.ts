import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchJobs = createAsyncThunk('jobs/fetchJobs', async (params: any = {}, thunkAPI) => {
  try {
    const response = await api.get('/api/jobs', { params });
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to fetch jobs');
  }
});

export const createJob = createAsyncThunk('jobs/createJob', async (jobData: any, thunkAPI) => {
  try {
    const response = await api.post('/api/jobs', jobData);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to create job');
  }
});

export const updateJob = createAsyncThunk('jobs/updateJob', async ({ id, data }: { id: number, data: any }, thunkAPI) => {
  try {
    const response = await api.put(`/api/jobs/${id}`, data);
    return response.data;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to update job');
  }
});

export const deleteJob = createAsyncThunk('jobs/deleteJob', async (id: number, thunkAPI) => {
  try {
    await api.delete(`/api/jobs/${id}`);
    return id;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || 'Failed to delete job');
  }
});

const jobSlice = createSlice({
  name: 'jobs',
  initialState: {
    jobs: [] as any[],
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
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.jobs;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create
      .addCase(createJob.fulfilled, (state, action) => {
        state.jobs.unshift(action.payload);
      })
      // Update
      .addCase(updateJob.fulfilled, (state, action) => {
        const index = state.jobs.findIndex(j => j.id === action.payload.id);
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.jobs = state.jobs.filter(j => j.id !== action.payload);
      });
  }
});

export default jobSlice.reducer;
