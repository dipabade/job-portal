import { combineReducers } from '@reduxjs/toolkit';
import mode from '../features/theme/mode-slice';
import jobs from '../features/jobs/jobsSlice';

const rootReducer = combineReducers({
  mode,
  jobs,
});

export default rootReducer;
