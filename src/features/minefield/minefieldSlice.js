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
        }
    }
})

export const { updateMinefield, generateMineField } = minefieldSlice.actions

export const selectMineField = (state) => state.minefield.minefield

const generateMines = () => {
    /*
        HxW mines
        Beginner: 9x9 10
        Intermediate: 16x14 40
        Expert 16x30 99
    */
        let mineCount = 99
        let rowCount = 16
        let columnCount = 30
        let newMinefield = Array(rowCount).fill().map(() => Array(columnCount).fill(0));
        let indexList = []
        for (var i = 0; i < rowCount * columnCount; i++){
            indexList.push(i)
        }
        for (var j = 0; j < mineCount; j++){
            let randomIndexLocation = Math.floor(Math.random() * (indexList.length - 1))
            let randomIndex = indexList[randomIndexLocation]
            let mineRow = Math.floor(randomIndex/columnCount)
            let mineColumn = randomIndex - mineRow*columnCount
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

export default minefieldSlice.reducer;