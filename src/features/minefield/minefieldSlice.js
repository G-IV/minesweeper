import { createSlice } from "@reduxjs/toolkit";
import { 
    getOffsetCoordinate,
    getAdjacentCells,
    clearCellAndSurroudingCells,
} from '../../hooks/minefield'

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
        clearCell: (state, action) => {
            state.minefield = clearCellAndSurroudingCells(action.payload, state.minefield)
        },
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
                c.adjacentCells = getAdjacentCells(c, newMinefield)
            })
        })
        return newMinefield
}

export const cellUpdater = (cell, minefield) => {
    cell.updates.forEach((update) => {
        minefield[cell.row][cell.col][update.key] = update.val
    })
    return minefield
}

export default minefieldSlice.reducer;