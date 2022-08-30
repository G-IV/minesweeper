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
            state.minefield = generateMines(action.payload)
        },
        updateCell: (state, action) => {
            state.minefield = cellUpdater(action.payload, [...state.minefield])
        },
        updateAdjacentCells: (state, action) => {
            const adjacent = adjacentCells(action.payload, [...state.minefield])
            const cell = {
                row: action.payload.row, 
                col: action.payload.col,
                updates: [{key: 'adjacentCells', val: adjacent}]
            }
            state.minefield = cellUpdater(cell, [...state.minefield])
        },
        clearCell: (state, action) => {
            state.minefield = cellClearer(action.payload, [...state.minefield])
        }
    }
})

export const { updateMinefield, generateMineField, updateCell, updateAdjacentCells, clearCell } = minefieldSlice.actions

export const selectMineField = (state) => state.minefield.minefield

export const generateMines = (mineFieldOptions={count: 99, rows: 16, columns: 30}) => {
    /*
        HxW mines
        Beginner: 9x9 10
        Intermediate: 16x14 40
        Expert 16x30 99
    */
        // validate args, use defaults if any are missing
        const rowCount = mineFieldOptions.rows
        const columnCount = mineFieldOptions.columns
        const mineCount = mineFieldOptions.count > rowCount * columnCount ? rowCount * columnCount * .2 : mineFieldOptions.count
        let newMinefield = Array(rowCount).fill().map(() => Array(columnCount).fill(false));
        let indexList = []
        for (var i = 0; i < rowCount * columnCount; i++){
            indexList.push(i)
        }
        for (var j = 0; j < mineCount; j++){
            let randomIndexLocation = Math.floor(Math.random() * (indexList.length - 1))
            let randomIndex = indexList[randomIndexLocation]
            let mineRow = Math.floor(randomIndex/columnCount)
            let mineColumn = randomIndex - mineRow*columnCount
            newMinefield[mineRow][mineColumn] = true
            indexList.splice(randomIndexLocation, 1)
        }
        newMinefield = newMinefield.map((row, rowIndex) => row.map((col, colIndex) => {return {
            id: `${rowIndex}_${colIndex}`, 
            hasMine: newMinefield[rowIndex][colIndex], 
            row: rowIndex, 
            col: colIndex,
            isFlagged: false,
            isCleared: false,
            adjacentCells: []
        }}))
        return newMinefield
}

export const cellClearer = (cell, mineField) => {
    const adjacentCells = mineField[cell.row][cell.col].adjacentCells
    const mineCount = adjacentCells.filter((cell) => cell.hasMine).length
    mineField[cell.row][cell.col].isCleared = true
    if (mineCount === 0) {
        // I think I need a recursive function to clear out the appropriate cells if adjacent cells also have 0 adjacent mines
        adjacentCells.forEach((c) => {
            mineField[c.row][c.col].isCleared = true
        })
    }
    return mineField
}

export const cellUpdater = (cell, minefield) => {
    cell.updates.forEach((update) => {
        minefield[cell.row][cell.col][update.key] = update.val
    })
    return minefield
}

export const getOffsetCoordinate = (cell, index) => {
    var row = cell.row + ([0,1,2].includes(index) ? -1 : [3,4].includes(index) ? 0 : 1)
    var col = cell.col + ([0,3,5].includes(index) ? -1 : [1,6].includes(index) ? 0 : 1)
    return {row, col} 
}

export const getOffsetValue = (cellOffset, mineField) => {
    if (
        cellOffset.row > -1 && 
        cellOffset.row < mineField.length && 
        cellOffset.col > -1 && 
        cellOffset.col < mineField[0].length) {
        return mineField[cellOffset.row][cellOffset.col].hasMine
    }
    return null
}

export const adjacentCells = (cell, minefield) => {
    const touching = Array(8).fill().map((elem, index) => {
        const offset = getOffsetCoordinate(cell, index)
        const hasMine = getOffsetValue(offset, minefield)
        return {row: offset.row, col: offset.col, hasMine: hasMine}
    })
    return touching.filter((adjacentField) => adjacentField.hasMine !== null)
}

export default minefieldSlice.reducer;