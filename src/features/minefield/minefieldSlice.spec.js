import minefieldReducer, {
    generateMineField,
    generateMines,
    cellUpdater,
    getOffsetCoordinate,
    getOffsetValue,
    adjacentCells,
    updateAdjacentCells,
    updateCell,
    cellClearer,
    clearCell,
} from './minefieldSlice';

// Commonly used functions.
const countMines = (minefield=[]) => {
    let aField = [...minefield]
    return [].concat(...aField).flat().filter((cell) => cell.hasMine).length
}
const mineFieldSize = (minefield) => {
    return [minefield.length, minefield[0].length]
}

describe('minefield reducer', () => {
    const initialState = {
        minefield: []
    };
    it('should handle initial state', () => {
        expect(minefieldReducer(undefined, {type: 'unknown'})).toEqual({
            minefield: []
        })
    });
    it('should handle generate minefield', () => {
        const actual = minefieldReducer(initialState, generateMineField());
        const actualMineCount = countMines(actual.minefield)
        expect(actualMineCount).toEqual(99)
    })
    it('should handle update minefield', () => {
        const actual = minefieldReducer(initialState, generateMineField());
        const actualMineCount = countMines(actual.minefield)
        expect(actualMineCount).toEqual(99)
    })
    it('should update cell', () => {
        const newMinefield = generateMines({count: 99, rows: 16, columns: 30})
        let expectedCell = {...newMinefield[0][0]}
        expectedCell.val = expectedCell.val === 1 ? 0 : 1
        expectedCell.isFlagged = !expectedCell.isFlagged
        expectedCell.isCleared = !expectedCell.isCleared
        expectedCell.adjacentCells = [
            {row: 0, col: 1, val: newMinefield[0][1].val},
            {row: 1, col: 0, val: newMinefield[1][0].val},
            {row: 1, col: 1, val: newMinefield[1][1].val},
        ]
        const updateDetails = {
            row: 0, col: 0, updates:[
                {key: 'val', val: expectedCell.val},
                {key: 'isFlagged', val: expectedCell.isFlagged},
                {key: 'isCleared', val: expectedCell.isCleared},
                {key: 'adjacentCells', val: expectedCell.adjacentCells},
            ]
        }
        initialState.minefield = newMinefield
        const actualState = minefieldReducer(initialState, updateCell(updateDetails))
        const actualCell = {...actualState.minefield[0][0]}
        expect(expectedCell.val).toEqual(actualCell.val)
        expect(expectedCell.isFlagged).toEqual(actualCell.isFlagged)
        expect(expectedCell.isCleared).toEqual(actualCell.isCleared)
        expect(expectedCell.adjacentCells).toEqual(actualCell.adjacentCells)
    })
    it('should update minefield cell with adjacent cells', () => {
        const mineField = [
            [{id: '0_0', hasMine: false, row: 0, col: 0, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '0_1', hasMine: true,  row: 0, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '0_2', hasMine: false, row: 0, col: 2, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '0_3', hasMine: true,  row: 0, col: 3, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '0_4', hasMine: false, row: 0, col: 4, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '0_5', hasMine: true,  row: 0, col: 5, isFlagged: false, isCleared: false, adjacentCells: []},],
            [{id: '1_0', hasMine: false, row: 1, col: 0, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '1_1', hasMine: true,  row: 1, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '1_2', hasMine: false, row: 1, col: 2, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '1_3', hasMine: true,  row: 1, col: 3, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '1_4', hasMine: false, row: 1, col: 4, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '1_5', hasMine: true,  row: 1, col: 5, isFlagged: false, isCleared: false, adjacentCells: []},],
            [{id: '2_0', hasMine: false, row: 2, col: 0, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '2_1', hasMine: true,  row: 2, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '2_2', hasMine: false, row: 2, col: 2, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '2_3', hasMine: true,  row: 2, col: 3, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '2_4', hasMine: false, row: 2, col: 4, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '2_5', hasMine: true,  row: 2, col: 5, isFlagged: false, isCleared: false, adjacentCells: []},],
            [{id: '3_0', hasMine: false, row: 2, col: 0, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '3_1', hasMine: true,  row: 3, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '3_2', hasMine: false, row: 3, col: 2, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '3_3', hasMine: true,  row: 3, col: 3, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '3_4', hasMine: false, row: 3, col: 4, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '3_5', hasMine: true,  row: 3, col: 5, isFlagged: false, isCleared: false, adjacentCells: []},]
        ]
        let row = 2, col = 2
        let cell = {...mineField[row][col]}
        let expectedAdjacentCells = [
            {hasMine: true,  row: 1, col: 1},
            {hasMine: false, row: 1, col: 2},
            {hasMine: true,  row: 1, col: 3},
            {hasMine: true,  row: 2, col: 1},
            {hasMine: true,  row: 2, col: 3},
            {hasMine: true,  row: 3, col: 1},
            {hasMine: false, row: 3, col: 2},
            {hasMine: true,  row: 3, col: 3},
        ]
        let currentState = {minefield: mineField}
        const actualState = minefieldReducer(currentState, updateAdjacentCells(cell))
        let actualAdjacentCells = actualState.minefield[row][col].adjacentCells
        expect(actualAdjacentCells).toEqual(expectedAdjacentCells)
    })
    it('should clear cells surrounding a cell with no adjacent mines', () => {
        const mineField = [
            [{id: '0_0', hasMine: false, row: 0, col: 0, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '0_1', hasMine: false, row: 0, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '0_2', hasMine: false, row: 0, col: 2, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '0_3', hasMine: false, row: 0, col: 3, isFlagged: false, isCleared: false, adjacentCells: []},],
            [{id: '1_0', hasMine: false, row: 1, col: 0, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '1_1', hasMine: false, row: 1, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '1_2', hasMine: false, row: 1, col: 2, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '1_3', hasMine: false, row: 1, col: 3, isFlagged: false, isCleared: false, adjacentCells: []},],
            [{id: '2_0', hasMine: true,  row: 2, col: 0, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '2_1', hasMine: false, row: 2, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '2_2', hasMine: false, row: 2, col: 2, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '2_3', hasMine: false, row: 2, col: 3, isFlagged: false, isCleared: false, adjacentCells: []},],
            [{id: '3_0', hasMine: false, row: 3, col: 0, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '3_1', hasMine: false, row: 3, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '3_2', hasMine: false, row: 3, col: 2, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '3_3', hasMine: false, row: 3, col: 3, isFlagged: false, isCleared: false, adjacentCells: []},]
        ]
        let updatedMinefield = Array(4).fill().map(() => Array(4).fill());
        let expectedMinefield = Array(4).fill().map(() => Array(4).fill());
        updatedMinefield.forEach((row, rIndex) => {
            row.forEach((cell, cIndex) => {
                const adjCells = adjacentCells({row: rIndex, col: cIndex}, mineField)
                let thisCell = {...mineField[rIndex][cIndex]}
                thisCell.adjacentCells = adjCells
                updatedMinefield[thisCell.row][thisCell.col] = {...thisCell}
                expectedMinefield[thisCell.row][thisCell.col] = {...thisCell}
            })
        })
        const state = {minefield: updatedMinefield}
        let selectedCell = updatedMinefield[1][2]
        expectedMinefield.forEach((row) => {
            row.forEach((cell) => {
                if((cell.row !== 2 || cell.col !== 0) && (cell.row !== 3 || cell.col !== 0)){
                    cell.isCleared = true
                } else {
                    cell.isCleared = false
                }
            }) 
        })
        const actualState = minefieldReducer(state, clearCell(selectedCell))
        expect(actualState.minefield).toEqual(expectedMinefield)
    })
    it('should show all mines if a cell with a mine is cleared', () => {
        const mineField = [
            [{id: '0_0', hasMine: false, row: 0, col: 0, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '0_1', hasMine: true,  row: 0, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '0_2', hasMine: false, row: 0, col: 2, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '0_3', hasMine: false, row: 0, col: 3, isFlagged: false, isCleared: false, adjacentCells: []},],
            [{id: '1_0', hasMine: false, row: 1, col: 0, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '1_1', hasMine: false, row: 1, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '1_2', hasMine: false, row: 1, col: 2, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '1_3', hasMine: false, row: 1, col: 3, isFlagged: false, isCleared: false, adjacentCells: []},],
            [{id: '2_0', hasMine: true,  row: 2, col: 0, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '2_1', hasMine: true,  row: 2, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '2_2', hasMine: false, row: 2, col: 2, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '2_3', hasMine: false, row: 2, col: 3, isFlagged: false, isCleared: false, adjacentCells: []},],
            [{id: '3_0', hasMine: true,  row: 3, col: 0, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '3_1', hasMine: false, row: 3, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '3_2', hasMine: false, row: 3, col: 2, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '3_3', hasMine: false, row: 3, col: 3, isFlagged: false, isCleared: false, adjacentCells: []},]
        ]
        let updatedMinefield = Array(4).fill().map(() => Array(4).fill());
        let expectedMinefield = Array(4).fill().map(() => Array(4).fill());
        updatedMinefield.forEach((row, rIndex) => {
            row.forEach((cell, cIndex) => {
                const adjCells = adjacentCells({row: rIndex, col: cIndex}, mineField)
                let thisCell = {...mineField[rIndex][cIndex]}
                thisCell.adjacentCells = adjCells
                updatedMinefield[thisCell.row][thisCell.col] = {...thisCell}
                expectedMinefield[thisCell.row][thisCell.col] = {...thisCell}
            })
        })
        const state = {minefield: updatedMinefield}
        let selectedCell = updatedMinefield[0][1]
        expectedMinefield[0][1].isCleared = true
        expectedMinefield[2][0].isCleared = true
        expectedMinefield[2][1].isCleared = true
        expectedMinefield[3][0].isCleared = true
        const actualState = minefieldReducer(state, clearCell(selectedCell))
        expect(actualState.minefield).toEqual(expectedMinefield)
    })
})

describe('helper functions', () => {
    let newMinefield = generateMines()
    it('by default, generateMines should generate a 16x30 array', () => {
        const actualSize = mineFieldSize(newMinefield)
        expect([16,30]).toEqual(actualSize)
    })
    it('by default, generateMines should generate 99 mines', () => {
        const actualMineCount = countMines(newMinefield)
        expect(99).toEqual(actualMineCount)
    })
    let fullArgs = {count: 10, rows: 5, columns: 10}
    it('given a full set of argments, generateMines should generate a 5x10 array', () => {
        newMinefield = generateMines(fullArgs)
        const actualSize = mineFieldSize(newMinefield)
        expect([fullArgs.rows, fullArgs.columns]).toEqual(actualSize)
    })
    it('given a full set of argments, generateMines should generate 10 mines', () => {
        newMinefield = generateMines(fullArgs)
        const actualMineCount = countMines(newMinefield)
        expect(fullArgs.count).toEqual(actualMineCount)
    })
    it('cellUpdater should update all fields', () => {
        let expectedCell = {...newMinefield[0][0]}
        expectedCell.val = expectedCell.val === 1 ? 0 : 1
        expectedCell.isFlagged = !expectedCell.isFlagged
        expectedCell.isCleared = !expectedCell.isCleared
        expectedCell.adjacentCells = [
            {row: 0, col: 1, val: newMinefield[0][1].val},
            {row: 1, col: 0, val: newMinefield[1][0].val},
            {row: 1, col: 1, val: newMinefield[1][1].val},
        ]
        const updateDetails = {
            row: 0, col: 0, updates:[
                {key: 'val', val: expectedCell.val},
                {key: 'isFlagged', val: expectedCell.isFlagged},
                {key: 'isCleared', val: expectedCell.isCleared},
                {key: 'adjacentCells', val: expectedCell.adjacentCells},
            ]
        }
        const updatedMinefield = cellUpdater(updateDetails, newMinefield)
        const actualCell = {...updatedMinefield[0][0]}
        expect(expectedCell.val).toEqual(actualCell.val)
        expect(expectedCell.isFlagged).toEqual(actualCell.isFlagged)
        expect(expectedCell.isCleared).toEqual(actualCell.isCleared)
        expect(expectedCell.adjacentCells).toEqual(actualCell.adjacentCells)
        
    })
    /*
        0   1   2
        3   C   4
        5   6   7

        #'s are offest indeces
        C is the cell location, {row, col}
        If the index
            is b/n 0-2, than adjacent row is 1 row up.  So subtract 1 from cell.row
            is b/n 3/4, than adjacent row match cell.row.  So return cell.row
            is b/n 5-7, than adjacent row is 1 row down.  So add 1 to cell.row
        if the index
            is in [0,3,5], than the adjacent column should be to the left.  So subtract 1 from the cell.col
            is in [1,6], than the adjacent column sould match cell.col.  So return cell.col
            is in [2,2,7], than the adjacent column should be to the right.  So add 1 to cell.col
        
        It is ok if a cell has a -1 index for either the row or column, that will get filterd out of the final adject cells array.
    */
    it('given a cell location of {0,0} and offset index, getOffsetByIndex should return a {row, col} with some (-1) index values', () => {
        const cell = {row: 0, col: 0}
        const actualOffsetCoordinateAt0 = getOffsetCoordinate(cell, 0)
        const actualOffsetCoordinateAt1 = getOffsetCoordinate(cell, 1)
        const actualOffsetCoordinateAt2 = getOffsetCoordinate(cell, 2)
        const actualOffsetCoordinateAt3 = getOffsetCoordinate(cell, 3)
        const actualOffsetCoordinateAt4 = getOffsetCoordinate(cell, 4)
        const actualOffsetCoordinateAt5 = getOffsetCoordinate(cell, 5)
        const actualOffsetCoordinateAt6 = getOffsetCoordinate(cell, 6)
        const actualOffsetCoordinateAt7 = getOffsetCoordinate(cell, 7)
        expect(actualOffsetCoordinateAt0).toEqual({row: -1, col: -1})
        expect(actualOffsetCoordinateAt1).toEqual({row: -1, col:  0})
        expect(actualOffsetCoordinateAt2).toEqual({row: -1, col:  1})
        expect(actualOffsetCoordinateAt3).toEqual({row:  0, col: -1})
        expect(actualOffsetCoordinateAt4).toEqual({row:  0, col:  1})
        expect(actualOffsetCoordinateAt5).toEqual({row:  1, col: -1})
        expect(actualOffsetCoordinateAt6).toEqual({row:  1, col:  0})
        expect(actualOffsetCoordinateAt7).toEqual({row:  1, col:  1})
    })
    it('given a cell location of {3,4} and offset index, getOffsetByIndex should return a {row, col}', () => {
        const cell = {row: 3, col: 4}
        const actualOffsetCoordinateAt0 = getOffsetCoordinate(cell, 0)
        const actualOffsetCoordinateAt1 = getOffsetCoordinate(cell, 1)
        const actualOffsetCoordinateAt2 = getOffsetCoordinate(cell, 2)
        const actualOffsetCoordinateAt3 = getOffsetCoordinate(cell, 3)
        const actualOffsetCoordinateAt4 = getOffsetCoordinate(cell, 4)
        const actualOffsetCoordinateAt5 = getOffsetCoordinate(cell, 5)
        const actualOffsetCoordinateAt6 = getOffsetCoordinate(cell, 6)
        const actualOffsetCoordinateAt7 = getOffsetCoordinate(cell, 7)
        expect(actualOffsetCoordinateAt0).toEqual({row: 2, col: 3})
        expect(actualOffsetCoordinateAt1).toEqual({row: 2, col:  4})
        expect(actualOffsetCoordinateAt2).toEqual({row: 2, col:  5})
        expect(actualOffsetCoordinateAt3).toEqual({row:  3, col: 3})
        expect(actualOffsetCoordinateAt4).toEqual({row:  3, col:  5})
        expect(actualOffsetCoordinateAt5).toEqual({row:  4, col: 3})
        expect(actualOffsetCoordinateAt6).toEqual({row:  4, col:  4})
        expect(actualOffsetCoordinateAt7).toEqual({row:  4, col:  5})
    })
    it('given a cell location, {row, col}, it should return the cell value or null if outside the minefield array', () => {
        const mineField = generateMines()
        const actualValueAtExisting = getOffsetValue({row: 1, col: 1}, mineField)
        const actualValueAtNonExisting = getOffsetValue({row: -1, col: 1}, mineField)
        expect(actualValueAtExisting).toEqual(mineField[1][1].hasMine)
        expect(actualValueAtNonExisting).toEqual(null)
    })
    it('given a cell and minefield, should return an array of valid, non-null valued adjacent cells', () => {
        const mineField = [
            [{id: '0_0', hasMine: false, row: 0, col: 0, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '0_1', hasMine: true,  row: 0, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '0_2', hasMine: false, row: 0, col: 2, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '0_3', hasMine: true,  row: 0, col: 3, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '0_4', hasMine: false, row: 0, col: 4, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '0_5', hasMine: true,  row: 0, col: 5, isFlagged: false, isCleared: false, adjacentCells: []},],
            [{id: '1_0', hasMine: false, row: 1, col: 0, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '1_1', hasMine: true,  row: 1, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '1_2', hasMine: false, row: 1, col: 2, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '1_3', hasMine: true,  row: 1, col: 3, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '1_4', hasMine: false, row: 1, col: 4, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '1_5', hasMine: true,  row: 1, col: 5, isFlagged: false, isCleared: false, adjacentCells: []},],
            [{id: '2_0', hasMine: false, row: 2, col: 0, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '2_1', hasMine: true,  row: 2, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '2_2', hasMine: false, row: 2, col: 2, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '2_3', hasMine: true,  row: 2, col: 3, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '2_4', hasMine: false, row: 2, col: 4, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '2_5', hasMine: true,  row: 2, col: 5, isFlagged: false, isCleared: false, adjacentCells: []},],
            [{id: '3_0', hasMine: false, row: 2, col: 0, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '3_1', hasMine: true,  row: 3, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '3_2', hasMine: false, row: 3, col: 2, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '3_3', hasMine: true,  row: 3, col: 3, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '3_4', hasMine: false, row: 3, col: 4, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '3_5', hasMine: true,  row: 3, col: 5, isFlagged: false, isCleared: false, adjacentCells: []},]
        ]
        let row = 2, col = 2
        let cell = {...mineField[row][col]}
        let expectedAdjacentCells = [
            {hasMine: true,  row: 1, col: 1},
            {hasMine: false, row: 1, col: 2},
            {hasMine: true,  row: 1, col: 3},
            {hasMine: true,  row: 2, col: 1},
            {hasMine: true,  row: 2, col: 3},
            {hasMine: true,  row: 3, col: 1},
            {hasMine: false, row: 3, col: 2},
            {hasMine: true,  row: 3, col: 3},
        ]
        let actualAdjacentCells = adjacentCells(cell, mineField)
        expect(actualAdjacentCells).toEqual(expectedAdjacentCells)
        row = 3, col = 2
        cell = {...mineField[row][col]}
        expectedAdjacentCells = [
            {hasMine: true,  row: 2, col: 1},
            {hasMine: false, row: 2, col: 2},
            {hasMine: true,  row: 2, col: 3},
            {hasMine: true,  row: 3, col: 1},
            {hasMine: true,  row: 3, col: 3},
        ]
        actualAdjacentCells = adjacentCells(cell, mineField)
        expect(actualAdjacentCells).toEqual(expectedAdjacentCells)
    })
    it('should return a minefield with the adjacent cells cleared when adjacent mine count is 0', () => {
        const mineField = [
            [{id: '0_0', hasMine: false, row: 0, col: 0, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '0_1', hasMine: false, row: 0, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '0_2', hasMine: false, row: 0, col: 2, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '0_3', hasMine: false, row: 0, col: 3, isFlagged: false, isCleared: false, adjacentCells: []},],
            [{id: '1_0', hasMine: false, row: 1, col: 0, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '1_1', hasMine: false, row: 1, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '1_2', hasMine: false, row: 1, col: 2, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '1_3', hasMine: false, row: 1, col: 3, isFlagged: false, isCleared: false, adjacentCells: []},],
            [{id: '2_0', hasMine: true,  row: 2, col: 0, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '2_1', hasMine: false, row: 2, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '2_2', hasMine: false, row: 2, col: 2, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '2_3', hasMine: false, row: 2, col: 3, isFlagged: false, isCleared: false, adjacentCells: []},],
            [{id: '3_0', hasMine: false, row: 3, col: 0, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '3_1', hasMine: false, row: 3, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '3_2', hasMine: false, row: 3, col: 2, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '3_3', hasMine: false, row: 3, col: 3, isFlagged: false, isCleared: false, adjacentCells: []},]
        ]
        let updatedMinefield = Array(4).fill().map(() => Array(4).fill());
        let expectedMinefield = Array(4).fill().map(() => Array(4).fill());
        updatedMinefield.forEach((row, rIndex) => {
            row.forEach((cell, cIndex) => {
                const adjCells = adjacentCells({row: rIndex, col: cIndex}, mineField)
                let thisCell = {...mineField[rIndex][cIndex]}
                thisCell.adjacentCells = adjCells
                updatedMinefield[thisCell.row][thisCell.col] = {...thisCell}
                expectedMinefield[thisCell.row][thisCell.col] = {...thisCell}
            })
        })
        let selectedCell = updatedMinefield[1][2]
        const actualMinefield = cellClearer(selectedCell, [...updatedMinefield])
        expectedMinefield.forEach((row) => {
            row.forEach((cell) => {
                if((cell.row !== 2 || cell.col !== 0) && (cell.row !== 3 || cell.col !== 0)){
                    cell.isCleared = true
                } else {
                    cell.isCleared = false
                }
            }) 
        })
        expect(actualMinefield).toEqual(expectedMinefield)
    })
    it('should show all mines if a cell with a mine is cleared', () => {
        const mineField = [
            [{id: '0_0', hasMine: false, row: 0, col: 0, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '0_1', hasMine: true,  row: 0, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '0_2', hasMine: false, row: 0, col: 2, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '0_3', hasMine: false, row: 0, col: 3, isFlagged: false, isCleared: false, adjacentCells: []},],
            [{id: '1_0', hasMine: false, row: 1, col: 0, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '1_1', hasMine: false, row: 1, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '1_2', hasMine: false, row: 1, col: 2, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '1_3', hasMine: false, row: 1, col: 3, isFlagged: false, isCleared: false, adjacentCells: []},],
            [{id: '2_0', hasMine: true,  row: 2, col: 0, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '2_1', hasMine: true,  row: 2, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '2_2', hasMine: false, row: 2, col: 2, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '2_3', hasMine: false, row: 2, col: 3, isFlagged: false, isCleared: false, adjacentCells: []},],
            [{id: '3_0', hasMine: true,  row: 3, col: 0, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '3_1', hasMine: false, row: 3, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '3_2', hasMine: false, row: 3, col: 2, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '3_3', hasMine: false, row: 3, col: 3, isFlagged: false, isCleared: false, adjacentCells: []},]
        ]
        let updatedMinefield = Array(4).fill().map(() => Array(4).fill());
        let expectedMinefield = Array(4).fill().map(() => Array(4).fill());
        updatedMinefield.forEach((row, rIndex) => {
            row.forEach((cell, cIndex) => {
                const adjCells = adjacentCells({row: rIndex, col: cIndex}, mineField)
                let thisCell = {...mineField[rIndex][cIndex]}
                thisCell.adjacentCells = adjCells
                updatedMinefield[thisCell.row][thisCell.col] = {...thisCell}
                expectedMinefield[thisCell.row][thisCell.col] = {...thisCell}
            })
        })
        let selectedCell = updatedMinefield[0][1]
        const actualMinefield = cellClearer(selectedCell, [...updatedMinefield])
        expectedMinefield[0][1].isCleared = true
        expectedMinefield[2][0].isCleared = true
        expectedMinefield[2][1].isCleared = true
        expectedMinefield[3][0].isCleared = true
        expect(actualMinefield).toEqual(expectedMinefield)
    })
})