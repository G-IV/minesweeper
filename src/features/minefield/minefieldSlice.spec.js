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
    adjacentCellsClearer,
} from './minefieldSlice';

// Commonly used functions.
const countMines = (minefield=[]) => {
    let aField = [...minefield]
    return [].concat(...aField).flat().filter((cell) => cell.hasMine).length
}
const mineFieldSize = (minefield) => {
    return [minefield.length, minefield[0].length]
}
const setAdjacentFields = (minefield) => {
    minefield.forEach((row, rIndex) => {
        row.forEach((cell, cIndex) => {
            const adjCells = adjacentCells({row: rIndex, col: cIndex}, minefield)
            // let thisCell = {...minefield[rIndex][cIndex]}
            // thisCell.adjacentCells = adjCells
            // minefield[thisCell.row][thisCell.col] = {...thisCell}
            minefield[rIndex][cIndex].adjacentCells = adjCells
        })
    })
    return minefield
}

Array.prototype.copyMinefield = function() {
    return [...this.map((row) => [...row.map((cell) => {return {...cell}})])]
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
    it('should generate a minefield with 99 mines when args are empty', () => {
        const actual = minefieldReducer(initialState, generateMineField());
        const actualMineCount = countMines(actual.minefield)
        expect(actualMineCount).toEqual(0)
    })
    it('should generate a minefield with the correct number of mines when count is not empty and a valid cell is clicked', () => {
        const actual = minefieldReducer(initialState, 
            generateMineField({count: 99, rows: 16, columns: 30, cell: {row:0, col: 0}}));
        const actualMineCount = countMines(actual.minefield)
        expect(actualMineCount).toEqual(99)
    })
    it('should update cell', () => {
        const newMinefield = generateMines({count: 99, rows: 16, columns: 30, cell: {row: 0, col: 5}})
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
})

describe('helper functions', () => {
    let newMinefield = generateMines()
    it('by default, generateMines should generate a 16x30 array with 0 mines', () => {
        const actualSize = mineFieldSize(newMinefield)
        const actualMineCount = countMines(newMinefield)
        expect([16,30]).toEqual(actualSize)
        expect(0).toEqual(actualMineCount)
    })
    let fullArgs = {count: 10, rows: 5, columns: 10, cell: {row:0, col: 0}}
    it('given a full set of argments, generateMines should generate a 5x10 array and 10 mines', () => {
        newMinefield = generateMines(fullArgs)
        const actualSize = mineFieldSize(newMinefield)
        const actualMineCount = countMines(newMinefield)
        expect(fullArgs.count).toEqual(actualMineCount)
        expect([fullArgs.rows, fullArgs.columns]).toEqual(actualSize)
    })
    it('when clicking the first cell in a field with only 1 empty space, generateMines should return the clicked cell as the only cleared cell', () => {
        let actualField = generateMines({count: 3, rows: 2, columns: 2, cell: {row: 0, col: 0}})
        let expectedField = actualField.copyMinefield()
        expectedField[0][0].hasMine = false
        expectedField[0][1].hasMine = true
        expectedField[1][0].hasMine = true
        expectedField[1][1].hasMine = true
        expect(expectedField).toEqual(actualField)
    })
    
})