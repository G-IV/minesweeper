import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    row: -1,
    col: -1,
    adjacentMineCount: 0,
    hasMine: false
}

export const cellSlice = createSlice({
    name: 'cell',
    initialState,
    reducers:{
        initCell: (state, action) => {
            state.row = action.payload.row;
            state.col = action.payload.col;
            state.adjacentMineCount = action.payload.adjacentMineCount
            state.hasMine = action.payload.hasMine
        }
    }
})

export const { initCell } = cellSlice.actions

export const selectRow = (state) => state.cell.row
export const selectCol = (state) => state.cell.col
export const selectAdjacentMineCount = (state) => state.cell.adjacentMineCount
export const selectHasMine = (state) => state.cell.hasMine

export default cellSlice.reducer;