import { combineReducers, configureStore } from '@reduxjs/toolkit';
import minefieldReducer from '../features/minefield/minefieldSlice'
import cellSliceReducer from '../features/cell/cellSlice';
import timerSliceReducer from '../features/timer/timerSlice'

const rootReducer = combineReducers({
  minefield: minefieldReducer,
  cell: cellSliceReducer,
  timer: timerSliceReducer,
})

export const setupStore = (preloadedState) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState
  })
}
