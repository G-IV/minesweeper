import timerReducer, { incrementSeconds, setSeconds, setTimerState } from './timerSlice'

describe('timer reducer', () => {
    const initialState = {
        seconds: 0,
        timerState: 'clear',
    }
    it('setSeconds() -> should set seconds to the value in the payload', () => {
        const actualState = timerReducer(initialState, setSeconds(5))
        const expectedSeconds = 5
        expect(actualState.seconds).toEqual(expectedSeconds)
    })
    it('incrementSeconds() -> should increment seconds to the value in the payload', () => {
        const actualState = timerReducer(initialState, incrementSeconds())
        const expectedSeconds = 1
        expect(actualState.seconds).toEqual(expectedSeconds)
    })
    it('setTimerState() -> should increment seconds to the value in the payload', () => {
        const actualState = timerReducer(initialState, setTimerState('new game'))
        const expectedTimerState = 'new game'
        expect(actualState.timerState).toEqual(expectedTimerState)
    })
})