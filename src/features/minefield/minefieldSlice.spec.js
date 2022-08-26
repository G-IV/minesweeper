import minefieldReducer, {
    generateMineField,
    generateMines,
    updateCell,
    cellUpdater
} from './minefieldSlice';

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
        const mineCount = [].concat(...actual.minefield).flat().filter((cell) => cell.val === 1).length
        expect(mineCount).toEqual(99)
    })
    it('should handle update minefield', () => {
        const actual = minefieldReducer(initialState, generateMineField());
        const mineCount = [].concat(...actual.minefield).flat().filter((cell) => cell.val === 1).length
        expect(mineCount).toEqual(99)
    })
})

describe('helper functions', () => {
    const countMines = (minefield=[]) => {
        let aField = [...minefield]
        return [].concat(...aField).flat().filter((cell) => cell.val === 1).length
    }
    const mineFieldSize = (minefield) => {
        return [minefield.length, minefield[0].length]
    }
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
})