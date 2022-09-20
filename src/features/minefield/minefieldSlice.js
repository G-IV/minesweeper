import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    minefield: [],
    gameState: 'Waiting'
}

export const minefieldSlice = createSlice({
    name: 'minefield',
    initialState,
    reducers: {
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
        },
        clearAdjacentCells: (state, action) => {
            state.minefield = adjacentCellsClearer(action.payload, [...state.minefield])
        }
    }
})

export const { generateMineField, updateCell, updateAdjacentCells, clearCell, clearAdjacentCells } = minefieldSlice.actions

export const selectMineField = (state) => state.minefield.minefield

export const generateMines = (mineFieldOptions={count: 0, rows: 16, columns: 30, cell: {row: -1, col: -1}}) => {
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
        const cell = mineFieldOptions.cell
        let newMinefield = Array(rowCount).fill().map(() => Array(columnCount).fill(false));
        let mustBeClear = []
        // If the mine count is greater than or equal to the size of the field, there is no reason to attempt to give the user a cell w/ no mine
        if (cell.row > -1 && cell.col > -1) {
            if(mineCount < rowCount * columnCount){
                // At a minimum, the clicked cell should be clear
                const cellIndex = cell.row * columnCount + cell.col
                mustBeClear.push(cellIndex)
                // Calculate the number of surrounding cells that should be cleared.
                // Total Cells in the minefield - (mineCount + 1) <-- +1 to include the already clicked cell
                // At the most, there can only be 8 surrounding cells
                let offsetQty = Math.min(rowCount * columnCount - (mineCount + 1), 8)
                if (offsetQty > 0){
                    // The way I'm building the array means I'll filter out the value "4" -> but if I filter it out, I need to increment the offsetQty to ensure the same number of adjacent cells are handled
                    offsetQty = offsetQty > 4 ? offsetQty + 1 : offsetQty
                    mustBeClear = mustBeClear.concat([...Array(offsetQty).keys()].filter((val) => val !== 4).map((offset) => {
                        const offsetCoordinates = getOffsetCoordinate(cell, offset)
                        return offsetCoordinates.row * columnCount + offsetCoordinates.col
                    }))
                }
            }
            let indexList = [...Array(rowCount * columnCount).keys()]
            for (var j = 0; j < mineCount; j++){
                let randomIndexLocation = -1
                // I used a do while loop to ensure that the cell clicked + it's adjacent cells have no mines
                do {
                    randomIndexLocation = Math.floor(Math.random() * (indexList.length))
                } while (mustBeClear.includes(indexList[randomIndexLocation]));
                let randomIndex = indexList[randomIndexLocation]
                let mineRow = Math.floor(randomIndex/columnCount)
                let mineColumn = randomIndex - mineRow*columnCount
                newMinefield[mineRow][mineColumn] = true
                indexList.splice(randomIndexLocation, 1)
            }
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
        newMinefield.forEach((row) => {
            row.forEach((c) => {
                c.adjacentCells = adjacentCells(c, newMinefield)
            })
        })
        return newMinefield
}

export const cellClearer = (cell, mineField) => {

    // If there are no cleared cells, this indicates that the user is starting a new game.
    if(mineField.flat().filter((cell) => cell.isCleared).length === 0){
        mineField = generateMines({count: 99, rows: 16, columns: 30, cell: {row: cell.row, col: cell.col}})
    }

    // Clear the clicked cell
    mineField[cell.row][cell.col].isCleared = true

    // If the user uncovered a mine, show all the mines
    if(mineField[cell.row][cell.col].hasMine){
        mineField.forEach((row) => row.forEach((cell) => cell.isCleared = cell.hasMine ? true : cell.isCleared))
        return mineField
    }

    // Check if all the non-mine spaces have been cleared
    const clearedCellQty = mineField.flat().filter((cell) => cell.isCleared).length
    const mineCount = mineField.flat().filter((cell) => cell.hasMine).length
    const totalCleared = mineField.length * mineField[0].length - mineCount
    if(clearedCellQty === totalCleared){
        mineField.forEach((row) => row.forEach((cell) => cell.isFlagged = cell.hasMine))
    }

    // Check the cell's adjacent fields for mines, if none, apply algorithm to clear out all adjacent cells with no mines
    let adjacentCellList = mineField[cell.row][cell.col].adjacentCells
    const mineQty = adjacentCellList.reduce((prev, curr) => {return prev + curr.hasMine ? 1 : 0}, 0)
    if(mineQty === 0){
        adjacentCellList
            .filter((adjCell) => mineField[adjCell.row][adjCell.col].isCleared === false)
            .forEach((adjCell) => {mineField = cellClearer(adjCell, mineField)})
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
    var row = cell.row + ([0,1,2].includes(index) ? -1 : [3,5].includes(index) ? 0 : 1)
    var col = cell.col + ([0,3,6].includes(index) ? -1 : [1,7].includes(index) ? 0 : 1)
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
    /* 
        [0] [1] [2]
        [3] [4] [5]
        [6] [7] [8]
    Where [4] is the center cell that I need to find the adjacent cells for.
    So I generate a 1x9 array, get the keys (this way I generate an array of [0,1,2,...,8])
    I filter out #4 (since that isn't an adjacent cell)
    I use map to return an array of cells based on the index of the adjacent cell.
    */
    const touching = [...Array(9).keys()].filter((val) => val !== 4).map((elem, index, arr) => {
        const offset = getOffsetCoordinate(cell, elem)
        const hasMine = getOffsetValue(offset, minefield)
        return {row: offset.row, col: offset.col, hasMine: hasMine}
    })
    return touching.filter((adjacentField) => adjacentField.hasMine !== null)
}

export const adjacentCellsClearer = (cell, minefield) => {
    const adjacentCells = [...minefield[cell.row][cell.col].adjacentCells]
    const mineCount = adjacentCells.map((c) => minefield[c.row][c.col].hasMine ? 1 : 0).reduce((prev, curr) => prev + curr)
    const flaggedCount = adjacentCells.map((c) => minefield[c.row][c.col].isFlagged ? 1 : 0).reduce((prev, curr) => prev + curr)
    if(mineCount === flaggedCount){
        adjacentCells.forEach((c) => {
            if(!minefield[c.row][c.col].isFlagged){
                minefield = cellClearer(c, minefield)
            }
        })
    }
    return minefield
}

export default minefieldSlice.reducer;