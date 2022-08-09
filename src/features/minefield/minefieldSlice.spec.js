import minefieldReducer, {
    generateMineField,
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
        let flattenedField = [].concat(...actual.minefield)
        const mineCount = flattenedField.flat().filter((cell) => cell.val === 1).length
        expect(mineCount).toEqual(99)
    })
})