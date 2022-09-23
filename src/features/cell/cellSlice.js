import { createSlice } from "@reduxjs/toolkit";
import { clearCellAndSurroudingCells, isGameActive } from "../../hooks/minefield";
import { generateMines } from "../minefield/minefieldSlice";

const initialState = {}

export const cellSlice = createSlice({
    name: 'cell',
    initialState,
    reducers: {
        clearCell: (state, action) => {
            if(isGameActive(state.minefield)){
                state.minefield = clearCellAndSurroudingCells(action.payload, state.minefield)
            } else {
                state.minefield = generateMines({count: 99, rows: 16, columns: 30, cell: {row: action.payload.row, col: action.payload.col}})
            }
        }
    }
})

export const {clearCell} = cellSlice.actions

export default cellSlice.reducer;