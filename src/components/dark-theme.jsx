import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleMode } from '../store/features/theme/mode-slice';

export default function Toggle() {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.mode.darkMode);

  return (
    <button
      onClick={() => dispatch(toggleMode())}
      className='theme-toggle'
      aria-label='Toggle dark mode'
    >
      {darkMode ? '🌙' : '☀️'}
    </button>
  );
}
