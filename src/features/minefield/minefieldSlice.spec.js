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
            [{id: '0_0', hasMine: true,  row: 0, col: 0, isFlagged: false, isCleared: false, adjacentCells: []},
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
            [{id: '3_0', hasMine: false, row: 3, col: 0, isFlagged: false, isCleared: true,  adjacentCells: []},
             {id: '3_1', hasMine: false, row: 3, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '3_2', hasMine: false, row: 3, col: 2, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '3_3', hasMine: false, row: 3, col: 3, isFlagged: false, isCleared: false, adjacentCells: []},]
        ]
        let updatedMinefield = mineField.copyMinefield()
        updatedMinefield.forEach((row, rIndex) => {
            row.forEach((cell, cIndex) => {
                const adjCells = adjacentCells({row: rIndex, col: cIndex}, mineField)
                let thisCell = {...mineField[rIndex][cIndex]}
                thisCell.adjacentCells = adjCells
                updatedMinefield[thisCell.row][thisCell.col] = {...thisCell}
            })
        })
        let selectedCell = updatedMinefield[1][2]
        let expectedMinefield = updatedMinefield.copyMinefield()
        expectedMinefield.forEach((row) => {
            row.forEach((cell) => {
                if(cell.col !== 0){
                    cell.isCleared = true
                }
            }) 
        })
        const state = {minefield: updatedMinefield}
        const actualState = minefieldReducer(state, clearCell(selectedCell))
        expect(actualState.minefield).toEqual(expectedMinefield)
    })
    it('should show all mines if a cell with a mine is cleared', () => {
        const mineField = [
            [{id: '0_0', hasMine: false, row: 0, col: 0, isFlagged: false, isCleared: true, adjacentCells: []},
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
        let updatedMinefield = mineField.copyMinefield()
        updatedMinefield.forEach((row, rIndex) => {
            row.forEach((cell, cIndex) => {
                const adjCells = adjacentCells({row: rIndex, col: cIndex}, mineField)
                let thisCell = {...mineField[rIndex][cIndex]}
                thisCell.adjacentCells = adjCells
                updatedMinefield[thisCell.row][thisCell.col] = {...thisCell}
            })
        })
        let selectedCell = updatedMinefield[0][1]
        let expectedMinefield = updatedMinefield.copyMinefield()
        expectedMinefield[0][1].isCleared = true
        expectedMinefield[2][0].isCleared = true
        expectedMinefield[2][1].isCleared = true
        expectedMinefield[3][0].isCleared = true

        const state = {minefield: updatedMinefield}
        const actualState = minefieldReducer(state, clearCell(selectedCell))
        expect(actualState.minefield).toEqual(expectedMinefield)
    })
    it('should show all mines if a cell with a mine is cleared', () => {
        const mineField = [
            [{id: '0_0', hasMine: false, row: 0, col: 0, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '0_1', hasMine: true,  row: 0, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '0_2', hasMine: false, row: 0, col: 2, isFlagged: false, isCleared: true, adjacentCells: []},
             {id: '0_3', hasMine: false, row: 0, col: 3, isFlagged: false, isCleared: true, adjacentCells: []},],
            [{id: '1_0', hasMine: false, row: 1, col: 0, isFlagged: false, isCleared: true, adjacentCells: []},
             {id: '1_1', hasMine: false, row: 1, col: 1, isFlagged: false, isCleared: true, adjacentCells: []},
             {id: '1_2', hasMine: false, row: 1, col: 2, isFlagged: false, isCleared: true, adjacentCells: []},
             {id: '1_3', hasMine: false, row: 1, col: 3, isFlagged: false, isCleared: true, adjacentCells: []},],
            [{id: '2_0', hasMine: true,  row: 2, col: 0, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '2_1', hasMine: true,  row: 2, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '2_2', hasMine: false, row: 2, col: 2, isFlagged: false, isCleared: true, adjacentCells: []},
             {id: '2_3', hasMine: false, row: 2, col: 3, isFlagged: false, isCleared: true, adjacentCells: []},],
            [{id: '3_0', hasMine: true,  row: 3, col: 0, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '3_1', hasMine: false, row: 3, col: 1, isFlagged: false, isCleared: true, adjacentCells: []},
             {id: '3_2', hasMine: false, row: 3, col: 2, isFlagged: false, isCleared: true, adjacentCells: []},
             {id: '3_3', hasMine: false, row: 3, col: 3, isFlagged: false, isCleared: true, adjacentCells: []},]
        ]
        let updatedMinefield = mineField.copyMinefield()
        updatedMinefield.forEach((row, rIndex) => {
            row.forEach((cell, cIndex) => {
                const adjCells = adjacentCells({row: rIndex, col: cIndex}, mineField)
                let thisCell = {...mineField[rIndex][cIndex]}
                thisCell.adjacentCells = adjCells
                updatedMinefield[thisCell.row][thisCell.col] = {...thisCell}
            })
        })
        let selectedCell = updatedMinefield[0][0]
        let expectedMinefield = updatedMinefield.copyMinefield()
        expectedMinefield.forEach((row) => row.forEach((cell) => {
            cell.isCleared = !cell.hasMine
            cell.isFlagged = cell.hasMine
            return cell
        }))
        const state = {minefield: updatedMinefield}
        const actualState = minefieldReducer(state, clearCell(selectedCell))
        expect(actualState.minefield).toEqual(expectedMinefield)
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
    it('when clicking the first cell in a field with only 2 empty cells, generateMines should return the clicked cell and 1 adjacent cell as the only cleared cells', () => {
        let actualField = generateMines({count: 2, rows: 2, columns: 2, cell: {row: 0, col: 0}})
        let emptyCount = adjacentCells({row: 0, col: 0}, actualField).filter((c) => !c.hasMine).length
        expect(1).toEqual(emptyCount)
    })
    it('when clicking the first cell in a field with only 3 empty cells, generateMines should return the clicked cell and 2 adjacent cells as the only cleared cells', () => {
        let actualField = generateMines({count: 1, rows: 2, columns: 2, cell: {row: 0, col: 0}})
        let emptyCount = adjacentCells({row: 0, col: 0}, actualField).filter((c) => !c.hasMine).length
        expect(2).toEqual(emptyCount)
    })
    it('when clicking the a cell in a field with > 8 empty cells, generateMines should return the clicked cell and all adjacent cells as cleared cells', () => {
        let actualField = generateMines({count: 3, rows: 3, columns: 4, cell: {row: 1, col: 1}})
        let emptyCount = adjacentCells({row: 1, col: 1}, actualField)
        emptyCount.push(actualField[1][1])
        let filteredEmptyCount = emptyCount.filter((c) => !c.hasMine).length
        expect(filteredEmptyCount).toEqual(9)
    })
    it('cellUpdater should update start a new game when the cell clicked is the first cleared cell', () => {
        const clickedCell = {row: 4, col: 6}
        let cellClicked = {...newMinefield[clickedCell.row][clickedCell.col]}
        cellClicked.hasMine = false
        cellClicked.isFlagged = false
        cellClicked.isCleared = true
        // There may be more adjacent cells to these that are also false, but this should be the minimum
        cellClicked.adjacentCells = [
            {row: clickedCell.row - 1, col: clickedCell.col - 1, hasMine: false},
            {row: clickedCell.row - 1, col: clickedCell.col,     hasMine: false},
            {row: clickedCell.row - 1, col: clickedCell.col + 1, hasMine: false},
            {row: clickedCell.row,     col: clickedCell.col - 1, hasMine: false},
            {row: clickedCell.row,     col: clickedCell.col + 1, hasMine: false},
            {row: clickedCell.row + 1, col: clickedCell.col - 1, hasMine: false},
            {row: clickedCell.row + 1, col: clickedCell.col,     hasMine: false},
            {row: clickedCell.row + 1, col: clickedCell.col + 1, hasMine: false},
        ]
        const updatedMinefield = cellClearer(cellClicked, newMinefield)
        const mineCount = countMines(updatedMinefield)
        const fieldSize = mineFieldSize(updatedMinefield)
        expect(mineCount).toEqual(99)
        expect(fieldSize).toEqual([16, 30])
        expect(cellClicked).toEqual(updatedMinefield[clickedCell.row][clickedCell.col])
        cellClicked.adjacentCells.forEach((cell) => {
            expect(cell.hasMine).toEqual(updatedMinefield[cell.row][cell.col].hasMine)
            expect(updatedMinefield[cell.row][cell.col].isCleared).toBeTruthy()
        })
    })
    // /*
    //     0   1   2
    //     3   C   5
    //     6   7   8

    //     #'s are offest indeces
    //     C is the cell location, {row, col}
    //     If the index
    //         is b/n 0-2, than adjacent row is 1 row up.  So subtract 1 from cell.row
    //         is b/n 3-5, than adjacent row match cell.row.  So return cell.row
    //         is b/n 6-8, than adjacent row is 1 row down.  So add 1 to cell.row
    //     if the index
    //         is in [0,3,6], than the adjacent column should be to the left.  So subtract 1 from the cell.col
    //         is in [1,7], than the adjacent column sould match cell.col.  So return cell.col
    //         is in [2,5,8], than the adjacent column should be to the right.  So add 1 to cell.col
        
    //     It is ok if a cell has a -1 index for either the row or column, that will get filterd out of the final adject cells array.
    // */
    it('given a cell location of {0,0} and offset index, getOffsetByIndex should return a {row, col} with some (-1) index values', () => {
        const cell = {row: 0, col: 0}
        const actualOffsetCoordinateAt0 = getOffsetCoordinate(cell, 0)
        const actualOffsetCoordinateAt1 = getOffsetCoordinate(cell, 1)
        const actualOffsetCoordinateAt2 = getOffsetCoordinate(cell, 2)
        const actualOffsetCoordinateAt3 = getOffsetCoordinate(cell, 3)
        const actualOffsetCoordinateAt5 = getOffsetCoordinate(cell, 5)
        const actualOffsetCoordinateAt6 = getOffsetCoordinate(cell, 6)
        const actualOffsetCoordinateAt7 = getOffsetCoordinate(cell, 7)
        const actualOffsetCoordinateAt8 = getOffsetCoordinate(cell, 8)
        expect(actualOffsetCoordinateAt0).toEqual({row: -1, col: -1})
        expect(actualOffsetCoordinateAt1).toEqual({row: -1, col:  0})
        expect(actualOffsetCoordinateAt2).toEqual({row: -1, col:  1})
        expect(actualOffsetCoordinateAt3).toEqual({row:  0, col: -1})
        expect(actualOffsetCoordinateAt5).toEqual({row:  0, col:  1})
        expect(actualOffsetCoordinateAt6).toEqual({row:  1, col: -1})
        expect(actualOffsetCoordinateAt7).toEqual({row:  1, col:  0})
        expect(actualOffsetCoordinateAt8).toEqual({row:  1, col:  1})
    })
    it('given a cell location of {3,4} and offset index, getOffsetByIndex should return a {row, col}', () => {
        const cell = {row: 3, col: 4}
        const actualOffsetCoordinateAt0 = getOffsetCoordinate(cell, 0)
        const actualOffsetCoordinateAt1 = getOffsetCoordinate(cell, 1)
        const actualOffsetCoordinateAt2 = getOffsetCoordinate(cell, 2)
        const actualOffsetCoordinateAt3 = getOffsetCoordinate(cell, 3)
        const actualOffsetCoordinateAt5 = getOffsetCoordinate(cell, 5)
        const actualOffsetCoordinateAt6 = getOffsetCoordinate(cell, 6)
        const actualOffsetCoordinateAt7 = getOffsetCoordinate(cell, 7)
        const actualOffsetCoordinateAt8 = getOffsetCoordinate(cell, 8)
        expect(actualOffsetCoordinateAt0).toEqual({row: 2, col: 3})
        expect(actualOffsetCoordinateAt1).toEqual({row: 2, col: 4})
        expect(actualOffsetCoordinateAt2).toEqual({row: 2, col: 5})
        expect(actualOffsetCoordinateAt3).toEqual({row: 3, col: 3})
        expect(actualOffsetCoordinateAt5).toEqual({row: 3, col: 5})
        expect(actualOffsetCoordinateAt6).toEqual({row: 4, col: 3})
        expect(actualOffsetCoordinateAt7).toEqual({row: 4, col: 4})
        expect(actualOffsetCoordinateAt8).toEqual({row: 4, col: 5})
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
            [{id: '0_0', hasMine: true,  row: 0, col: 0, isFlagged: false, isCleared: false, adjacentCells: []},
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
            [{id: '3_0', hasMine: false, row: 3, col: 0, isFlagged: false, isCleared: true,  adjacentCells: []},
             {id: '3_1', hasMine: false, row: 3, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '3_2', hasMine: false, row: 3, col: 2, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '3_3', hasMine: false, row: 3, col: 3, isFlagged: false, isCleared: false, adjacentCells: []},]
        ]
        let updatedMinefield = mineField.copyMinefield()
        updatedMinefield.forEach((row, rIndex) => {
            row.forEach((cell, cIndex) => {
                const adjCells = adjacentCells({row: rIndex, col: cIndex}, mineField)
                let thisCell = {...mineField[rIndex][cIndex]}
                thisCell.adjacentCells = adjCells
                updatedMinefield[thisCell.row][thisCell.col] = {...thisCell}
            })
        })
        let selectedCell = updatedMinefield[1][2]

        let expectedMinefield = updatedMinefield.copyMinefield()
        expectedMinefield.forEach((row) => {
            row.forEach((cell) => {
                if(cell.col !== 0){
                    cell.isCleared = true
                }
            }) 
        })
        const actualMinefield = cellClearer(selectedCell, [...updatedMinefield])
        expect(actualMinefield).toEqual(expectedMinefield)
    })
    it('should show all mines if a cell with a mine is cleared', () => {
        const mineField = [
            [{id: '0_0', hasMine: false, row: 0, col: 0, isFlagged: false, isCleared: true, adjacentCells: []},
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
        let updatedMinefield = mineField.copyMinefield()
        let expectedMinefield = mineField.copyMinefield()
        let selectedCell = updatedMinefield[0][1]
        expectedMinefield[0][1].isCleared = true
        expectedMinefield[2][0].isCleared = true
        expectedMinefield[2][1].isCleared = true
        expectedMinefield[3][0].isCleared = true
        const actualMinefield = cellClearer(selectedCell, [...updatedMinefield])
        expect(actualMinefield).toEqual(expectedMinefield)
    })
    it('should show all mines if a cell with a mine is cleared', () => {
        const mineField = [
            [{id: '0_0', hasMine: false, row: 0, col: 0, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '0_1', hasMine: true,  row: 0, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '0_2', hasMine: false, row: 0, col: 2, isFlagged: false, isCleared: true,  adjacentCells: []},
             {id: '0_3', hasMine: false, row: 0, col: 3, isFlagged: false, isCleared: true,  adjacentCells: []},],
            [{id: '1_0', hasMine: false, row: 1, col: 0, isFlagged: false, isCleared: true,  adjacentCells: []},
             {id: '1_1', hasMine: false, row: 1, col: 1, isFlagged: false, isCleared: true,  adjacentCells: []},
             {id: '1_2', hasMine: false, row: 1, col: 2, isFlagged: false, isCleared: true,  adjacentCells: []},
             {id: '1_3', hasMine: false, row: 1, col: 3, isFlagged: false, isCleared: true,  adjacentCells: []},],
            [{id: '2_0', hasMine: true,  row: 2, col: 0, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '2_1', hasMine: true,  row: 2, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '2_2', hasMine: false, row: 2, col: 2, isFlagged: false, isCleared: true,  adjacentCells: []},
             {id: '2_3', hasMine: false, row: 2, col: 3, isFlagged: false, isCleared: true,  adjacentCells: []},],
            [{id: '3_0', hasMine: true,  row: 3, col: 0, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '3_1', hasMine: false, row: 3, col: 1, isFlagged: false, isCleared: true,  adjacentCells: []},
             {id: '3_2', hasMine: false, row: 3, col: 2, isFlagged: false, isCleared: true,  adjacentCells: []},
             {id: '3_3', hasMine: false, row: 3, col: 3, isFlagged: false, isCleared: true,  adjacentCells: []},]
        ]
        let updatedMinefield = mineField.copyMinefield()
        let expectedMinefield = mineField.copyMinefield()
        let selectedCell = updatedMinefield[0][0]
        expectedMinefield.forEach((row) => row.forEach((cell) => {
            cell.isCleared = !cell.hasMine
            cell.isFlagged = cell.hasMine
            return cell
        }))
        const actualMinefield = cellClearer(selectedCell, [...updatedMinefield])
        expect(actualMinefield).toEqual(expectedMinefield)
    })
    it('should clear adjacent cells', () => {
        const startingField = setAdjacentFields([
            [{id: '0_0', hasMine: false, row: 0, col: 0, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '0_1', hasMine: false, row: 0, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '0_2', hasMine: false, row: 0, col: 2, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '0_3', hasMine: false, row: 0, col: 3, isFlagged: false, isCleared: false, adjacentCells: []},],
            [{id: '1_0', hasMine: false, row: 1, col: 0, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '1_1', hasMine: false, row: 1, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '1_2', hasMine: false, row: 1, col: 2, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '1_3', hasMine: false, row: 1, col: 3, isFlagged: false, isCleared: false, adjacentCells: []},],
            [{id: '2_0', hasMine: false, row: 2, col: 0, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '2_1', hasMine: true,  row: 2, col: 1, isFlagged: true,  isCleared: false, adjacentCells: []},
             {id: '2_2', hasMine: false, row: 2, col: 2, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '2_3', hasMine: false, row: 2, col: 3, isFlagged: false, isCleared: false, adjacentCells: []},],
            [{id: '3_0', hasMine: false, row: 3, col: 0, isFlagged: false, isCleared: true,  adjacentCells: []},
             {id: '3_1', hasMine: false, row: 3, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '3_2', hasMine: false, row: 3, col: 2, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '3_3', hasMine: false, row: 3, col: 3, isFlagged: false, isCleared: false, adjacentCells: []},]
        ])
        const expectedField = setAdjacentFields([
            [{id: '0_0', hasMine: false, row: 0, col: 0, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '0_1', hasMine: false, row: 0, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '0_2', hasMine: false, row: 0, col: 2, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '0_3', hasMine: false, row: 0, col: 3, isFlagged: false, isCleared: false, adjacentCells: []},],
            [{id: '1_0', hasMine: false, row: 1, col: 0, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '1_1', hasMine: false, row: 1, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '1_2', hasMine: false, row: 1, col: 2, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '1_3', hasMine: false, row: 1, col: 3, isFlagged: false, isCleared: false, adjacentCells: []},],
            [{id: '2_0', hasMine: false, row: 2, col: 0, isFlagged: false, isCleared: true,  adjacentCells: []},
             {id: '2_1', hasMine: true,  row: 2, col: 1, isFlagged: true,  isCleared: false, adjacentCells: []},
             {id: '2_2', hasMine: false, row: 2, col: 2, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '2_3', hasMine: false, row: 2, col: 3, isFlagged: false, isCleared: false, adjacentCells: []},],
            [{id: '3_0', hasMine: false, row: 3, col: 0, isFlagged: false, isCleared: true,  adjacentCells: []},
             {id: '3_1', hasMine: false, row: 3, col: 1, isFlagged: false, isCleared: true,  adjacentCells: []},
             {id: '3_2', hasMine: false, row: 3, col: 2, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '3_3', hasMine: false, row: 3, col: 3, isFlagged: false, isCleared: false, adjacentCells: []},]
        ])
        const actualField = adjacentCellsClearer(startingField[3][0], startingField)
        expect(actualField).toEqual(expectedField)
    })
    it('should do nothing when a user attempts to clear adjacent cells but the adjacent flagged cell count does not match the adjacent mine count', () => {
        const startingField = setAdjacentFields([
            [{id: '0_0', hasMine: false, row: 0, col: 0, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '0_1', hasMine: false, row: 0, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '0_2', hasMine: false, row: 0, col: 2, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '0_3', hasMine: false, row: 0, col: 3, isFlagged: false, isCleared: false, adjacentCells: []},],
            [{id: '1_0', hasMine: false, row: 1, col: 0, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '1_1', hasMine: false, row: 1, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '1_2', hasMine: false, row: 1, col: 2, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '1_3', hasMine: false, row: 1, col: 3, isFlagged: false, isCleared: false, adjacentCells: []},],
            [{id: '2_0', hasMine: false, row: 2, col: 0, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '2_1', hasMine: true,  row: 2, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '2_2', hasMine: false, row: 2, col: 2, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '2_3', hasMine: false, row: 2, col: 3, isFlagged: false, isCleared: false, adjacentCells: []},],
            [{id: '3_0', hasMine: false, row: 3, col: 0, isFlagged: false, isCleared: true,  adjacentCells: []},
             {id: '3_1', hasMine: false, row: 3, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '3_2', hasMine: false, row: 3, col: 2, isFlagged: false, isCleared: false, adjacentCells: []},
             {id: '3_3', hasMine: false, row: 3, col: 3, isFlagged: false, isCleared: false, adjacentCells: []},]
        ])
        const expectedField = startingField.copyMinefield()
        const actualField = adjacentCellsClearer(startingField[3][0], startingField)
        expect(actualField).toEqual(expectedField)
    })
})