import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    minefield: [],
}

export const minefieldSlice = createSlice({
    name: 'minefield',
    initialState,
    reducers: {
        updateMinefield: (state, action) => {
            state.minefield = action.payload
        },
        generateMineField: (state, action) => {
            state.minefield = generateMines()
        },
        updateCell: (state, action) => {
            state.minefield = cellUpdater(action.payload, [...state.minefield])
        }
    }
})

export const { updateMinefield, generateMineField, updateCell } = minefieldSlice.actions

export const selectMineField = (state) => state.minefield.minefield

export const generateMines = (mineFieldOptions={count: 99, rows: 16, columns: 30}) => {
    /*
        HxW mines
        Beginner: 9x9 10
        Intermediate: 16x14 40
        Expert 16x30 99
    */
        let newMinefield = Array(mineFieldOptions.rows).fill().map(() => Array(mineFieldOptions.columns).fill(0));
        let indexList = []
        for (var i = 0; i < mineFieldOptions.rows * mineFieldOptions.columns; i++){
            indexList.push(i)
        }
        for (var j = 0; j < mineFieldOptions.count; j++){
            let randomIndexLocation = Math.floor(Math.random() * (indexList.length - 1))
            let randomIndex = indexList[randomIndexLocation]
            let mineRow = Math.floor(randomIndex/mineFieldOptions.columns)
            let mineColumn = randomIndex - mineRow*mineFieldOptions.columns
            newMinefield[mineRow][mineColumn] = 1
            indexList.splice(randomIndexLocation, 1)
        }
        newMinefield = newMinefield.map((row, rowIndex) => row.map((col, colIndex) => {return {
            id: `${rowIndex}_${colIndex}`, 
            val: col, 
            row: rowIndex, 
            col: colIndex,
            isFlagged: false,
            isCleared: false,
            adjacentCells: []
        }}))
        return newMinefield
}

export const cellUpdater = (cell, minefield) => {
    cell.updates.forEach((update) => {
        minefield[cell.row][cell.col][update.key] = update.val
    })
    return minefield
}

export default minefieldSlice.reducer;