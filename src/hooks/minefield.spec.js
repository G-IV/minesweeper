import { generateMines, updateAdjacentCells } from '../features/minefield/minefieldSlice'
import {
    copyMinefield,
    countMines,
    countClearedCells,
    countNonMinedCells,
    countFlaggedCells,
    countAdjacentMines,
    isGameActive,
    getOffsetCoordinate,
    getOffsetValue,
    getAdjacentCells,
    allCellsCleared,
    exposeAllMines,
    flagAllMines,
    clearCellAndSurroudingCells,
} from './minefield'

describe('minefieldCopy()', () => {
    it('should make a deep copy of the minefield', () => {
        const newMinefield = generateMines()
        const copiedMinefield = copyMinefield(newMinefield)
        expect(copiedMinefield).toEqual(newMinefield)
        copiedMinefield[0][0].hasMine = !copiedMinefield[0][0].hasMine
        expect(copiedMinefield[0][0]).not.toEqual(newMinefield[0][0])
    })
})

describe('countMines()', () => {
    it('should return 0 for empty field', () => {
        const mineCount = countMines([])
        expect(0).toEqual(mineCount)
    })
    it('should return correct mine quantity in field', () => {
        const newMinefield = generateMines()
        const mineCount = countMines(newMinefield)
        expect(0).toEqual(mineCount)
    })
})

describe('countClearedCells()', () => {
    it('should return 0 for an empty field', () => {
        const clearedCellsCount = countClearedCells([])
        expect(0).toEqual(clearedCellsCount)
    })
    it('should return correct mine quantity in field', () => {
        // This isn't a completely true minefield, ie, I don't care if there is no way to reach this state.
        const minefield = [
            [
                {id: '0_0', hasMine: false, row: 0, col: 0, isFlagged: false, isCleared: true, adjacentCells: []},
                {id: '0_1', hasMine: false, row: 0, col: 1, isFlagged: false, isCleared: true, adjacentCells: []},
                {id: '0_2', hasMine: true, row: 0, col: 2, isFlagged: false, isCleared: false, adjacentCells: []},
            ],[
                {id: '1_0', hasMine: false, row: 1, col: 0, isFlagged: false, isCleared: true, adjacentCells: []},
                {id: '1_1', hasMine: false, row: 1, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
                {id: '1_2', hasMine: false, row: 1, col: 2, isFlagged: false, isCleared: false, adjacentCells: []},
            ]
        ]
        const clearedCellsCount = countClearedCells(minefield)
        expect(3).toEqual(clearedCellsCount)
    })
})

describe('countNonMinedCells()', () => {
    it('should return 0 for an empty field', () => {
        const nonMinedCellQty = countNonMinedCells([])
        expect(0).toEqual(nonMinedCellQty)
    })
    it('should return number of cells with no mine', () => {
        const args = {count: 10, rows: 5, columns: 10, cell: {row:0, col: 0}}
        const newMinefield = generateMines(args)
        const expectedQty = args.rows * args.columns - args.count
        const nonMinedCellQty = countNonMinedCells(newMinefield)
        expect(expectedQty).toEqual(nonMinedCellQty)
    })
})

describe('countFlaggedCells()', () => {
    it('should return 0 for an empty field', () => {
        const clearedCellsCount = countFlaggedCells([])
        expect(0).toEqual(clearedCellsCount)
    })
    it('should return correct mine quantity in field', () => {
        // This isn't a completely true minefield, ie, I don't care if there is no way to reach this state.
        const minefield = [
            [
                {id: '0_0', hasMine: false, row: 0, col: 0, isFlagged: false, isCleared: false, adjacentCells: []},
                {id: '0_1', hasMine: false, row: 0, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
                {id: '0_2', hasMine: true, row: 0, col: 2, isFlagged: true, isCleared: false, adjacentCells: []},
            ],[
                {id: '1_0', hasMine: true, row: 1, col: 0, isFlagged: true, isCleared: false, adjacentCells: []},
                {id: '1_1', hasMine: false, row: 1, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
                {id: '1_2', hasMine: false, row: 1, col: 2, isFlagged: false, isCleared: false, adjacentCells: []},
            ]
        ]
        const flaggedCellQty = countFlaggedCells(minefield)
        expect(2).toEqual(flaggedCellQty)
    })
})

describe('countAdjacentMines()', () => {
    let minefield = [
        [
            {id: '0_0', hasMine: false, row: 0, col: 0, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '0_1', hasMine: false, row: 0, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '0_2', hasMine: true, row: 0, col: 2, isFlagged: true, isCleared: false, adjacentCells: []},
            {id: '0_3', hasMine: false, row: 0, col: 3, isFlagged: true, isCleared: false, adjacentCells: []},
            {id: '0_4', hasMine: false, row: 0, col: 4, isFlagged: true, isCleared: false, adjacentCells: []},
            {id: '0_5', hasMine: false, row: 0, col: 5, isFlagged: true, isCleared: false, adjacentCells: []},
            {id: '0_6', hasMine: true, row: 0, col: 6, isFlagged: true, isCleared: false, adjacentCells: []},
        ],[
            {id: '1_0', hasMine: true, row: 1, col: 0, isFlagged: true, isCleared: false, adjacentCells: []},
            {id: '1_1', hasMine: false, row: 1, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '1_2', hasMine: false, row: 1, col: 2, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '1_3', hasMine: false, row: 1, col: 3, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '1_4', hasMine: true, row: 1, col: 4, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '1_5', hasMine: false, row: 1, col: 5, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '1_6', hasMine: false, row: 1, col: 6, isFlagged: false, isCleared: false, adjacentCells: []},
        ],[
            {id: '2_0', hasMine: true, row: 2, col: 0, isFlagged: true, isCleared: false, adjacentCells: []},
            {id: '2_1', hasMine: false, row: 2, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '2_2', hasMine: false, row: 2, col: 2, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '2_3', hasMine: true, row: 2, col: 3, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '2_4', hasMine: false, row: 2, col: 4, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '2_5', hasMine: true, row: 2, col: 5, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '2_6', hasMine: false, row: 2, col: 6, isFlagged: false, isCleared: false, adjacentCells: []},
        ],[
            {id: '3_0', hasMine: true, row: 3, col: 0, isFlagged: true, isCleared: false, adjacentCells: []},
            {id: '3_1', hasMine: false, row: 3, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '3_2', hasMine: false, row: 3, col: 2, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '3_3', hasMine: true, row: 3, col: 3, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '3_4', hasMine: false, row: 3, col: 4, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '3_5', hasMine: false, row: 3, col: 5, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '3_6', hasMine: true, row: 3, col: 6, isFlagged: false, isCleared: false, adjacentCells: []},
        ]
    ]
    minefield.forEach((row, i, field) => row.forEach((cell) => {
        cell.adjacentCells = getAdjacentCells(cell, field)
    }))
    it('should return the qty of adjacent mines', () => {
        const cell = minefield[0][1]
        const adjacentMineCount = countAdjacentMines(cell, minefield)
        expect(adjacentMineCount).toEqual(2)
    })
})

describe('activeGame()', () => {
    it('should return false when field has no mines', () => {
        const newMinefield = generateMines()
        const gameIsActive = isGameActive(newMinefield)
        expect(gameIsActive).toBeFalsy()
    })
    it('should return true when mines are present', () => {
        const args = {count: 10, rows: 5, columns: 10, cell: {row:0, col: 0}}
        const newMinefield = generateMines(args)
        const gameIsActive = isGameActive(newMinefield)
        expect(gameIsActive).toBeTruthy()

    })
})

describe('getOffsetCoordinate', () => {
    let cell = {id: '1_1', row: 1, col: 1}
    it('0 should return row - 1, col - 1', () => {
        const offset = getOffsetCoordinate(cell, 0)
        expect(offset).toEqual({row: cell.row - 1, col: cell.col - 1})
    })
    it('1 should return row - 1, col', () => {
        const offset = getOffsetCoordinate(cell, 1)
        expect(offset).toEqual({row: cell.row - 1, col: cell.col})
    })
    it('2 should return row - 1, col + 1', () => {
        const offset = getOffsetCoordinate(cell, 2)
        expect(offset).toEqual({row: cell.row - 1, col: cell.col + 1})
    })
    it('3 should return row, col - 1', () => {
        const offset = getOffsetCoordinate(cell, 3)
        expect(offset).toEqual({row: cell.row, col: cell.col - 1})
    })
    it('5 should return row, col + 1', () => {
        const offset = getOffsetCoordinate(cell, 5)
        expect(offset).toEqual({row: cell.row, col: cell.col + 1})
    })
    it('6 should return row + 1, col - 1', () => {
        const offset = getOffsetCoordinate(cell, 6)
        expect(offset).toEqual({row: cell.row + 1, col: cell.col - 1})
    })
    it('7 should return row + 1, col', () => {
        const offset = getOffsetCoordinate(cell, 7)
        expect(offset).toEqual({row: cell.row + 1, col: cell.col})
    })
    it('8 should return row + 1, col + 1', () => {
        const offset = getOffsetCoordinate(cell, 8)
        expect(offset).toEqual({row: cell.row + 1, col: cell.col + 1})
    })
})

describe('getOffsetValue', () => {
    let minefield = [
        [
            {id: '0_0', hasMine: false, row: 0, col: 0, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '0_1', hasMine: false, row: 0, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '0_2', hasMine: true, row: 0, col: 2, isFlagged: true, isCleared: false, adjacentCells: []},
            {id: '0_3', hasMine: true, row: 0, col: 3, isFlagged: true, isCleared: false, adjacentCells: []},
            {id: '0_4', hasMine: true, row: 0, col: 4, isFlagged: true, isCleared: false, adjacentCells: []},
            {id: '0_5', hasMine: true, row: 0, col: 5, isFlagged: true, isCleared: false, adjacentCells: []},
            {id: '0_6', hasMine: true, row: 0, col: 6, isFlagged: true, isCleared: false, adjacentCells: []},
        ],[
            {id: '1_0', hasMine: true, row: 1, col: 0, isFlagged: true, isCleared: false, adjacentCells: []},
            {id: '1_1', hasMine: false, row: 1, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '1_2', hasMine: false, row: 1, col: 2, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '1_3', hasMine: false, row: 1, col: 3, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '1_4', hasMine: false, row: 1, col: 4, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '1_5', hasMine: false, row: 1, col: 5, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '1_6', hasMine: false, row: 1, col: 6, isFlagged: false, isCleared: false, adjacentCells: []},
        ],[
            {id: '2_0', hasMine: true, row: 2, col: 0, isFlagged: true, isCleared: false, adjacentCells: []},
            {id: '2_1', hasMine: false, row: 2, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '2_2', hasMine: false, row: 2, col: 2, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '2_3', hasMine: false, row: 2, col: 3, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '2_4', hasMine: false, row: 2, col: 4, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '2_5', hasMine: false, row: 2, col: 5, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '2_6', hasMine: false, row: 2, col: 6, isFlagged: false, isCleared: false, adjacentCells: []},
        ],[
            {id: '3_0', hasMine: true, row: 3, col: 0, isFlagged: true, isCleared: false, adjacentCells: []},
            {id: '3_1', hasMine: false, row: 3, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '3_2', hasMine: false, row: 3, col: 2, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '3_3', hasMine: false, row: 3, col: 3, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '3_4', hasMine: false, row: 3, col: 4, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '3_5', hasMine: false, row: 3, col: 5, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '3_6', hasMine: false, row: 3, col: 6, isFlagged: false, isCleared: false, adjacentCells: []},
        ]
    ]
    it('should return null if row is < 0', () => {
        const offsetCell = getOffsetValue({row: -1, col: 0}, minefield)
        expect(offsetCell).toEqual(null)
    })
    it('should return null if col is < 0', () => {
        const offsetCell = getOffsetValue({row: 0, col: -1}, minefield)
        expect(offsetCell).toEqual(null)
    })
    it('should return offset if col & row are w/in bounds', () => {
        const offsetCell = getOffsetValue({row: 0, col: 1}, minefield)
        expect(offsetCell).toEqual(minefield[0][1].hasMine)
    })
})

describe('getAdjacentCells()', () => {
    let minefield = [
        [
            {id: '0_0', hasMine: false, row: 0, col: 0, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '0_1', hasMine: false, row: 0, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '0_2', hasMine: true, row: 0, col: 2, isFlagged: true, isCleared: false, adjacentCells: []},
            {id: '0_3', hasMine: true, row: 0, col: 3, isFlagged: true, isCleared: false, adjacentCells: []},
            {id: '0_4', hasMine: true, row: 0, col: 4, isFlagged: true, isCleared: false, adjacentCells: []},
            {id: '0_5', hasMine: true, row: 0, col: 5, isFlagged: true, isCleared: false, adjacentCells: []},
            {id: '0_6', hasMine: true, row: 0, col: 6, isFlagged: true, isCleared: false, adjacentCells: []},
        ],[
            {id: '1_0', hasMine: true, row: 1, col: 0, isFlagged: true, isCleared: false, adjacentCells: []},
            {id: '1_1', hasMine: false, row: 1, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '1_2', hasMine: false, row: 1, col: 2, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '1_3', hasMine: false, row: 1, col: 3, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '1_4', hasMine: false, row: 1, col: 4, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '1_5', hasMine: false, row: 1, col: 5, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '1_6', hasMine: false, row: 1, col: 6, isFlagged: false, isCleared: false, adjacentCells: []},
        ],[
            {id: '2_0', hasMine: true, row: 2, col: 0, isFlagged: true, isCleared: false, adjacentCells: []},
            {id: '2_1', hasMine: false, row: 2, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '2_2', hasMine: false, row: 2, col: 2, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '2_3', hasMine: false, row: 2, col: 3, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '2_4', hasMine: false, row: 2, col: 4, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '2_5', hasMine: false, row: 2, col: 5, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '2_6', hasMine: false, row: 2, col: 6, isFlagged: false, isCleared: false, adjacentCells: []},
        ],[
            {id: '3_0', hasMine: true, row: 3, col: 0, isFlagged: true, isCleared: false, adjacentCells: []},
            {id: '3_1', hasMine: false, row: 3, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '3_2', hasMine: false, row: 3, col: 2, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '3_3', hasMine: false, row: 3, col: 3, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '3_4', hasMine: false, row: 3, col: 4, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '3_5', hasMine: false, row: 3, col: 5, isFlagged: false, isCleared: false, adjacentCells: []},
            {id: '3_6', hasMine: false, row: 3, col: 6, isFlagged: false, isCleared: false, adjacentCells: []},
        ]
    ]
    it('should return correct adjacent cells for [0][0]', () => {
        const cell = minefield[0][0]
        const adjacentCells = getAdjacentCells(cell, minefield)
        const expectedAdjacentCells = [
            {row: cell.row, col: cell.col+1, hasMine: minefield[cell.row][cell.col+1].hasMine},
            {row: cell.row+1, col: cell.col, hasMine: minefield[cell.row+1][cell.col].hasMine},
            {row: cell.row+1, col: cell.col+1, hasMine: minefield[cell.row+1][cell.col+1].hasMine},
        ]
        expect(adjacentCells).toEqual(expectedAdjacentCells)
    })
    it('should return correct adjacent cells for [0][3]', () => {
        const cell = minefield[0][3]
        const adjacentCells = getAdjacentCells(cell, minefield)
        const expectedAdjacentCells = [
            {row: cell.row, col: cell.col-1, hasMine: minefield[cell.row][cell.col-1].hasMine},
            {row: cell.row, col: cell.col+1, hasMine: minefield[cell.row][cell.col+1].hasMine},
            {row: cell.row+1, col: cell.col-1, hasMine: minefield[cell.row+1][cell.col-1].hasMine},
            {row: cell.row+1, col: cell.col, hasMine: minefield[cell.row+1][cell.col].hasMine},
            {row: cell.row+1, col: cell.col+1, hasMine: minefield[cell.row+1][cell.col+1].hasMine},
        ]
        expect(adjacentCells).toEqual(expectedAdjacentCells)
    })
    it('should return correct adjacent cells for [0][6]', () => {
        const cell = minefield[0][6]
        const adjacentCells = getAdjacentCells(cell, minefield)
        const expectedAdjacentCells = [
            {row: cell.row, col: cell.col-1, hasMine: minefield[cell.row][cell.col-1].hasMine},
            {row: cell.row+1, col: cell.col-1, hasMine: minefield[cell.row+1][cell.col-1].hasMine},
            {row: cell.row+1, col: cell.col, hasMine: minefield[cell.row+1][cell.col].hasMine},
        ]
        expect(adjacentCells).toEqual(expectedAdjacentCells)
    })
    it('should return correct adjacent cells for [2][0]', () => {
        const cell = minefield[2][0]
        const adjacentCells = getAdjacentCells(cell, minefield)
        const expectedAdjacentCells = [
            {row: cell.row-1, col: cell.col, hasMine: minefield[cell.row-1][cell.col].hasMine},
            {row: cell.row-1, col: cell.col+1, hasMine: minefield[cell.row-1][cell.col+1].hasMine},
            {row: cell.row, col: cell.col+1, hasMine: minefield[cell.row][cell.col+1].hasMine},
            {row: cell.row+1, col: cell.col, hasMine: minefield[cell.row+1][cell.col].hasMine},
            {row: cell.row+1, col: cell.col+1, hasMine: minefield[cell.row+1][cell.col+1].hasMine},
        ]
        expect(adjacentCells).toEqual(expectedAdjacentCells)
    })
    it('should return correct adjacent cells for [2][2]', () => {
        const cell = minefield[2][2]
        const adjacentCells = getAdjacentCells(cell, minefield)
        const expectedAdjacentCells = [
            {row: cell.row-1, col: cell.col-1, hasMine: minefield[cell.row-1][cell.col-1].hasMine},
            {row: cell.row-1, col: cell.col, hasMine: minefield[cell.row-1][cell.col].hasMine},
            {row: cell.row-1, col: cell.col+1, hasMine: minefield[cell.row-1][cell.col+1].hasMine},
            {row: cell.row, col: cell.col-1, hasMine: minefield[cell.row][cell.col-1].hasMine},
            {row: cell.row, col: cell.col+1, hasMine: minefield[cell.row][cell.col+1].hasMine},
            {row: cell.row+1, col: cell.col-1, hasMine: minefield[cell.row+1][cell.col-1].hasMine},
            {row: cell.row+1, col: cell.col, hasMine: minefield[cell.row+1][cell.col].hasMine},
            {row: cell.row+1, col: cell.col+1, hasMine: minefield[cell.row+1][cell.col+1].hasMine},
        ]
        expect(adjacentCells).toEqual(expectedAdjacentCells)
    })
    it('should return correct adjacent cells for [2][6]', () => {
        const cell = minefield[2][6]
        const adjacentCells = getAdjacentCells(cell, minefield)
        const expectedAdjacentCells = [
            {row: cell.row-1, col: cell.col-1, hasMine: minefield[cell.row-1][cell.col-1].hasMine},
            {row: cell.row-1, col: cell.col, hasMine: minefield[cell.row-1][cell.col].hasMine},
            {row: cell.row, col: cell.col-1, hasMine: minefield[cell.row][cell.col-1].hasMine},
            {row: cell.row+1, col: cell.col-1, hasMine: minefield[cell.row+1][cell.col-1].hasMine},
            {row: cell.row+1, col: cell.col, hasMine: minefield[cell.row+1][cell.col].hasMine},
        ]
        expect(adjacentCells).toEqual(expectedAdjacentCells)
    })
    it('should return correct adjacent cells for [3][0]', () => {
        const cell = minefield[3][0]
        const adjacentCells = getAdjacentCells(cell, minefield)
        const expectedAdjacentCells = [
            {row: cell.row-1, col: cell.col, hasMine: minefield[cell.row-1][cell.col].hasMine},
            {row: cell.row-1, col: cell.col+1, hasMine: minefield[cell.row-1][cell.col+1].hasMine},
            {row: cell.row, col: cell.col+1, hasMine: minefield[cell.row][cell.col+1].hasMine},
        ]
        expect(adjacentCells).toEqual(expectedAdjacentCells)
    })
    it('should return correct adjacent cells for [3][3]', () => {
        const cell = minefield[3][3]
        const adjacentCells = getAdjacentCells(cell, minefield)
        const expectedAdjacentCells = [
            {row: cell.row-1, col: cell.col-1, hasMine: minefield[cell.row-1][cell.col-1].hasMine},
            {row: cell.row-1, col: cell.col, hasMine: minefield[cell.row-1][cell.col].hasMine},
            {row: cell.row-1, col: cell.col+1, hasMine: minefield[cell.row-1][cell.col+1].hasMine},
            {row: cell.row, col: cell.col-1, hasMine: minefield[cell.row][cell.col-1].hasMine},
            {row: cell.row, col: cell.col+1, hasMine: minefield[cell.row][cell.col+1].hasMine},
        ]
        expect(adjacentCells).toEqual(expectedAdjacentCells)
    })
    it('should return correct adjacent cells for [3][6]', () => {
        const cell = minefield[3][6]
        const adjacentCells = getAdjacentCells(cell, minefield)
        const expectedAdjacentCells = [
            {row: cell.row-1, col: cell.col-1, hasMine: minefield[cell.row-1][cell.col-1].hasMine},
            {row: cell.row-1, col: cell.col, hasMine: minefield[cell.row-1][cell.col].hasMine},
            {row: cell.row, col: cell.col-1, hasMine: minefield[cell.row][cell.col-1].hasMine},
        ]
        expect(adjacentCells).toEqual(expectedAdjacentCells)
    })
})

describe('allCellsCleared()', () => {
    it('should return false if not all cells have been cleared', () => {
        const minefield = [
            [
                {id: '0_0', hasMine: false, row: 0, col: 0, isFlagged: false, isCleared: true, adjacentCells: []},
                {id: '0_1', hasMine: false, row: 0, col: 0, isFlagged: false, isCleared: true, adjacentCells: []},
                {id: '0_2', hasMine: true, row: 0, col: 0, isFlagged: false, isCleared: false, adjacentCells: []},
            ],[
                {id: '1_0', hasMine: false, row: 0, col: 0, isFlagged: false, isCleared: true, adjacentCells: []},
                {id: '1_1', hasMine: false, row: 0, col: 0, isFlagged: false, isCleared: false, adjacentCells: []},
                {id: '1_2', hasMine: false, row: 0, col: 0, isFlagged: false, isCleared: false, adjacentCells: []},
            ]
        ]
        const areAllCellsCleared = allCellsCleared(minefield)
        expect(areAllCellsCleared).toBeFalsy()
    })
    it('should return true if all cells have been cleared', () => {
        const minefield = [
            [
                {id: '0_0', hasMine: false, row: 0, col: 0, isFlagged: false, isCleared: true, adjacentCells: []},
                {id: '0_1', hasMine: false, row: 0, col: 0, isFlagged: false, isCleared: true, adjacentCells: []},
                {id: '0_2', hasMine: true, row: 0, col: 0, isFlagged: false, isCleared: false, adjacentCells: []},
            ],[
                {id: '1_0', hasMine: false, row: 0, col: 0, isFlagged: false, isCleared: true, adjacentCells: []},
                {id: '1_1', hasMine: false, row: 0, col: 0, isFlagged: false, isCleared: true, adjacentCells: []},
                {id: '1_2', hasMine: false, row: 0, col: 0, isFlagged: false, isCleared: true, adjacentCells: []},
            ]
        ]
        const areAllCellsCleared = allCellsCleared(minefield)
        expect(areAllCellsCleared).toBeTruthy()
    })
})

describe('exposeAllMines()', () => {
    it('should expose all mines by setting all armed cells\' prop iscleared to true', () => {
        const args = {count: 10, rows: 5, columns: 10, cell: {row:0, col: 0}}
        const newMinefield = generateMines(args)
        const updatedMinefield = exposeAllMines(newMinefield)
        const mineCount = countMines(newMinefield)
        const clearedCount = countClearedCells(updatedMinefield)
        expect(clearedCount).toEqual(mineCount)
    })
})

describe('flagAllMines()', () => {
    it('should flag all cells with mines', () => {
        const args = {count: 10, rows: 5, columns: 10, cell: {row:0, col: 0}}
        const newMinefield = generateMines(args)
        const updatedMinefield = flagAllMines(newMinefield)
        const mineQty = countMines(newMinefield)
        const flaggedCellQty = countFlaggedCells(updatedMinefield)
        expect(flaggedCellQty).toEqual(mineQty)
    })
})

describe('clearCellAndSurroudingCells()', () => {
    let minefield
    beforeEach(() => {
        /*
            Minefield:
            x 0 1 2 3 4 5 6
            0 0 0 0 0 0 0 0
            1 0 0 1 0 0 0 0
            2 1 0 1 0 0 0 0
            3 0 0 0 1 0 0 1

            1 = mine
            0 = no mine

            If cell [0,0] is clicked, expect cells [0,1], [1,0], and [1,1] to clear
            If cell [1,5] is clicked, expect cells [0,4-6], [1,4-6], and [2,4-6] to clear
        */
        minefield = [
            [
                {id: '0_0', hasMine: false, row: 0, col: 0, isFlagged: false, isCleared: false, adjacentCells: []},
                {id: '0_1', hasMine: false, row: 0, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
                {id: '0_2', hasMine: false, row: 0, col: 2, isFlagged: true, isCleared: false, adjacentCells: []},
                {id: '0_3', hasMine: false, row: 0, col: 3, isFlagged: true, isCleared: false, adjacentCells: []},
                {id: '0_4', hasMine: false, row: 0, col: 4, isFlagged: true, isCleared: false, adjacentCells: []},
                {id: '0_5', hasMine: false, row: 0, col: 5, isFlagged: true, isCleared: false, adjacentCells: []},
                {id: '0_6', hasMine: false, row: 0, col: 6, isFlagged: true, isCleared: false, adjacentCells: []},
            ],[
                {id: '1_0', hasMine: false, row: 1, col: 0, isFlagged: true, isCleared: false, adjacentCells: []},
                {id: '1_1', hasMine: false, row: 1, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
                {id: '1_2', hasMine: true, row: 1, col: 2, isFlagged: false, isCleared: false, adjacentCells: []},
                {id: '1_3', hasMine: false, row: 1, col: 3, isFlagged: false, isCleared: false, adjacentCells: []},
                {id: '1_4', hasMine: false, row: 1, col: 4, isFlagged: false, isCleared: false, adjacentCells: []},
                {id: '1_5', hasMine: false, row: 1, col: 5, isFlagged: false, isCleared: false, adjacentCells: []},
                {id: '1_6', hasMine: false, row: 1, col: 6, isFlagged: false, isCleared: false, adjacentCells: []},
            ],[
                {id: '2_0', hasMine: true, row: 2, col: 0, isFlagged: true, isCleared: false, adjacentCells: []},
                {id: '2_1', hasMine: false, row: 2, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
                {id: '2_2', hasMine: true, row: 2, col: 2, isFlagged: false, isCleared: false, adjacentCells: []},
                {id: '2_3', hasMine: false, row: 2, col: 3, isFlagged: false, isCleared: false, adjacentCells: []},
                {id: '2_4', hasMine: false, row: 2, col: 4, isFlagged: false, isCleared: false, adjacentCells: []},
                {id: '2_5', hasMine: false, row: 2, col: 5, isFlagged: false, isCleared: false, adjacentCells: []},
                {id: '2_6', hasMine: false, row: 2, col: 6, isFlagged: false, isCleared: false, adjacentCells: []},
            ],[
                {id: '3_0', hasMine: false, row: 3, col: 0, isFlagged: true, isCleared: false, adjacentCells: []},
                {id: '3_1', hasMine: false, row: 3, col: 1, isFlagged: false, isCleared: false, adjacentCells: []},
                {id: '3_2', hasMine: false, row: 3, col: 2, isFlagged: false, isCleared: false, adjacentCells: []},
                {id: '3_3', hasMine: true, row: 3, col: 3, isFlagged: false, isCleared: false, adjacentCells: []},
                {id: '3_4', hasMine: false, row: 3, col: 4, isFlagged: false, isCleared: false, adjacentCells: []},
                {id: '3_5', hasMine: false, row: 3, col: 5, isFlagged: false, isCleared: false, adjacentCells: []},
                {id: '3_6', hasMine: true, row: 3, col: 6, isFlagged: false, isCleared: false, adjacentCells: []},
            ]
        ]
        minefield.forEach((row, i, field) => row.forEach((cell) => {
            cell.adjacentCells = getAdjacentCells(cell, field)
        }))
    })
    it('If cell [0,0] is clicked, expect cells [0,1], [1,0], and [1,1] to clear', () => {
        let copiedMinefield = copyMinefield(minefield)
        let clickedCell = minefield[0][0]
        const adjacentCells = getAdjacentCells(clickedCell, minefield)
        adjacentCells.forEach((cell) => {
            copiedMinefield[cell.row][cell.col].isCleared = true
        })
        copiedMinefield[clickedCell.row][clickedCell.col].isCleared = true
        const updatedMinefield = clearCellAndSurroudingCells(clickedCell, minefield)
        expect(updatedMinefield).toEqual(copiedMinefield)
    })
    it('If cell [1,5] is clicked, expect cells [0,4-6], [1,4-6], and [2,4-6] to clear', () => {
        let copiedMinefield = copyMinefield(minefield)
        let clickedCell = minefield[1][5]
        copiedMinefield[0][3].isCleared = true
        copiedMinefield[0][4].isCleared = true
        copiedMinefield[0][5].isCleared = true
        copiedMinefield[0][6].isCleared = true
        copiedMinefield[1][3].isCleared = true
        copiedMinefield[1][4].isCleared = true
        copiedMinefield[1][5].isCleared = true
        copiedMinefield[1][6].isCleared = true
        copiedMinefield[2][3].isCleared = true
        copiedMinefield[2][4].isCleared = true
        copiedMinefield[2][5].isCleared = true
        copiedMinefield[2][6].isCleared = true
        copiedMinefield[clickedCell.row][clickedCell.col].isCleared = true
        const updatedMinefield = clearCellAndSurroudingCells(clickedCell, minefield)
        expect(updatedMinefield).toEqual(copiedMinefield)
    })
})