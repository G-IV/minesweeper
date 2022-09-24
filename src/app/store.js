import { configureStore } from '@reduxjs/toolkit';
import minefieldReducer from '../features/minefield/minefieldSlice'
import cellSliceReducer from '../features/cell/cellSlice';
import timerSliceReducer from '../features/timer/timerSlice'

export const store = configureStore({
  reducer: {
    minefield: minefieldReducer,
    cell: cellSliceReducer,
    timer: timerSliceReducer,
  },
});
