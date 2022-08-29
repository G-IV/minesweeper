import { configureStore } from '@reduxjs/toolkit';
import minefieldReducer from '../features/minefield/minefieldSlice'
import cellSliceReducer from '../features/cell/cellSlice';

export const store = configureStore({
  reducer: {
    minefield: minefieldReducer,
    cell: cellSliceReducer,
  },
});
