import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    seconds: 0,
    timerState: 'clear',
}

export const timerSlice = createSlice({
    name: 'timer',
    initialState,
    reducers: {
        setSeconds: (state, action) => {
            state.seconds = action.payload
        },
        incrementSeconds: (state, action) => {
            state.seconds++
        },
        setTimerState: (state, action) => {
            state.timerState = action.payload
        },
    }
})

export const {
    setSeconds, 
    setTimerState, 
    incrementSeconds,
} = timerSlice.actions

export const selectSeconds = (state) => state.timer.seconds
export const selectTimerState = (state) => state.timer.timerState

export default timerSlice.reducer;