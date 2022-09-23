import { createSlice } from "@reduxjs/toolkit";
const initialState = {}

export const cellSlice = createSlice({
    name: 'cell',
    initialState,
    reducers: {}
})

export const {clearCell} = cellSlice.actions

export default cellSlice.reducer;