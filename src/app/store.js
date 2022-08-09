import { configureStore } from '@reduxjs/toolkit';
import minefieldReducer from '../features/minefield/minefieldSlice'

export const store = configureStore({
  reducer: {
    minefield: minefieldReducer,
  },
});
