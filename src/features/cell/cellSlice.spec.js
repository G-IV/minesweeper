import cellReducer, {
    initCell
} from './cellSlice';

describe('cell reducer', () => {
    const initialState = {
    };
    it('should handle initial state', () => {
        expect(cellReducer(undefined, {type: 'unknown'})).toEqual({})
    })
})

export const selectCellRow = (state) => state.cell.row