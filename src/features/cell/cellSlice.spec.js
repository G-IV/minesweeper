import cellReducer, {
    initCell
} from './cellSlice';

describe('cekk reducer', () => {
    const initialState = {
        row: -1,
        col: -1,
        adjacentMineCount: 0,
        hasMine: false
    };
    it('should handle initial state', () => {
        expect(cellReducer(undefined, {type: 'unknown'})).toEqual({
            row: -1,
            col: -1,
            adjacentMineCount: 0,
            hasMine: false
        })
    })
    it('should handle initializing values', () => {
        expect(cellReducer(initialState, initCell({row: 5, col: 4, adjacentMineCount: 7, hasMine: true}))).toEqual({
            row: 5, col: 4, adjacentMineCount: 7, hasMine: true
        })
    })
})

export const selectCellRow = (state) => state.cell.row