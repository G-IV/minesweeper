import { createSlice } from "@reduxjs/toolkit";
import { 
    getOffsetCoordinate,
    getAdjacentCells,
    clearCellAndSurroudingCells,
    exposeAllMines,
    clearAdjacentCells,
    getCellIndex,
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
            state.minefield = cellUpdater(action.payload, state.minefield)
        },
        clearCell: (state, action) => {
            state.minefield = clearCellAndSurroudingCells(action.payload, state.minefield)
        },
        clearNearbyCells: (state, action) => {
            state.minefield = clearAdjacentCells(action.payload, state.minefield)
        },
        exposeMines: (state, action) => {
            state.minefield = exposeAllMines(action.payload, state.minefield)
        }
    }
})

export const { 
    generateMineField, 
    updateCell, 
    updateAdjacentCells, 
    clearCell, 
    clearNearbyCells, 
    exposeMines,
} = minefieldSlice.actions

export const selectMineField = (state) => state.minefield.minefield

export const generateMines = (options={count: 0, rows: 16, columns: 30, cell: {row: -1, col: -1}}) => {
    /*
        HxW mines
        Beginner: 9x9 10
        Intermediate: 16x14 40
        Expert 16x30 99
    */
        // validate args, use defaults if any are missing, set up constants
        const rowCount = options.rows
        const columnCount = options.columns
        const mineCount = options.count > rowCount * columnCount ? rowCount * columnCount * .2 : options.count
        const cell = options.cell
        let newMinefield = Array(rowCount).fill().map(() => Array(columnCount).fill(false));
        let mustBeClear = []

        // helpers
        const cellExists = () => {
            return cell.row > -1 && cell.col > -1
        }

        const isMinefieldSizeLargerThanMineQty = () => {
            return mineCount < rowCount * columnCount
        }

        const identifyCellsThatCannotHaveMines = () => {
            // At a minimum, the clicked cell should be clear
            const cellIndex = getCellIndex(cell, newMinefield)
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

        const generateIndexList = () => {
            return [...Array(rowCount * columnCount).keys()]
        }

        const getRandomIndex = (indexList) => {
            // Recursively call itself if the random index is in the mustBeClear list
            let randomIndex = Math.floor(Math.random() * (indexList.length))
            if(mustBeClear.includes(indexList[randomIndex])){
                randomIndex = getRandomIndex(indexList)
            }
            return randomIndex
        }

        const randomlyAssignMines = () => {
            let indexList = generateIndexList()
            for (var j = 0; j < mineCount; j++){
                const randomIndexLocation = getRandomIndex(indexList)
                const randomIndex = indexList[randomIndexLocation]
                const mineRow = Math.floor(randomIndex/columnCount)
                const mineColumn = randomIndex - mineRow*columnCount
                newMinefield[mineRow][mineColumn] = true
                indexList.splice(randomIndexLocation, 1)
            }
        }

        const createNewMinefield = () => {
            newMinefield = newMinefield.map((row, rowIndex) => row.map((col, colIndex) => {return {
                id: `${rowIndex}_${colIndex}`, 
                row: rowIndex,
                col: colIndex,
                isCleared: false,
                isFlagged: false,
                wasTriggered: false,
                hasMine: newMinefield[rowIndex][colIndex], 
                adjacentCells: []
            }}))
            newMinefield.forEach((row) => {
                row.forEach((c) => {
                    c.adjacentCells = getAdjacentCells(c, newMinefield)
                })
            })
            return newMinefield
        }

        // Assign mines if the cell exists
        if (cellExists()) {
            if(isMinefieldSizeLargerThanMineQty()){
                identifyCellsThatCannotHaveMines()
            }
            randomlyAssignMines()
        }

        // Generate the minefield
        return createNewMinefield()
}

export const cellUpdater = (cell, minefield) => {
    cell.updates.forEach((update) => {
        minefield[cell.row][cell.col][update.key] = update.val
    })
    return minefield
}

export default minefieldSlice.reducer;