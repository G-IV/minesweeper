import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    time: 0,
}

export const controlsSlice = createSlice({
    name: 'controls',
    initialState,
    reducers: {}
})

export const {} = controlsSlice.actions

export default controlsSlice.reducer