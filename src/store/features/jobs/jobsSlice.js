import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '../../../supabaseClient';

export const fetchJobs = createAsyncThunk('jobs/fetchJobs', async () => {
  const { data, error } = await supabase
    .from('jobs')
    .select('id, title, company, location, salary, skills, description, created_at')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data;
});

const jobsSlice = createSlice({
  name: 'jobs',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearJobs: (state) => {
      state.list = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearJobs } = jobsSlice.actions;
export default jobsSlice.reducer;