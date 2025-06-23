import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  darkMode: JSON.parse(localStorage.getItem('darkMode')) ?? false,
};

const modeSlice = createSlice({
  name: 'mode',
  initialState,
  reducers: {
    toggleMode(state) {
      state.darkMode = !state.darkMode;
      localStorage.setItem('darkMode', JSON.stringify(state.darkMode));
    },
  },
});



export const { toggleMode } = modeSlice.actions;
export default modeSlice.reducer;
