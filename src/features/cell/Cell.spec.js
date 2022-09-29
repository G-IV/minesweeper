import React from "react";
import { fireEvent, screen } from "@testing-library/react";

import { renderWithProviders } from '../../utils/test-utils'

import Cell from "./Cell";
import { getAdjacentCells } from "../../hooks/minefield";

const setAdjacentCells = (minefield) => {
    minefield.forEach(
        (row) => row.forEach(
            (cell) => cell.adjacentCells =  getAdjacentCells(cell, minefield)
    ))
    return minefield
}
const defaultMinefield = [
    [
        {id: '0_0', hasMine: false, row: 0, col: 0, isFlagged: false, isCleared: false, wasTriggered: false, adjacentCells: []},
        {id: '0_1', hasMine: false, row: 0, col: 1, isFlagged: false, isCleared: false, wasTriggered: false, adjacentCells: []},
        {id: '0_2', hasMine: false, row: 0, col: 2, isFlagged: true, isCleared: false, wasTriggered: false, adjacentCells: []},
        {id: '0_3', hasMine: false, row: 0, col: 3, isFlagged: true, isCleared: false, wasTriggered: false, adjacentCells: []},
        {id: '0_4', hasMine: false, row: 0, col: 4, isFlagged: true, isCleared: false, wasTriggered: false, adjacentCells: []},
        {id: '0_5', hasMine: false, row: 0, col: 5, isFlagged: true, isCleared: false, wasTriggered: false, adjacentCells: []},
        {id: '0_6', hasMine: false, row: 0, col: 6, isFlagged: true, isCleared: false, wasTriggered: false, adjacentCells: []},
    ],[
        {id: '1_0', hasMine: false, row: 1, col: 0, isFlagged: true, isCleared: false, wasTriggered: false, adjacentCells: []},
        {id: '1_1', hasMine: false, row: 1, col: 1, isFlagged: false, isCleared: false, wasTriggered: false, adjacentCells: []},
        {id: '1_2', hasMine: true, row: 1, col: 2, isFlagged: false, isCleared: false, wasTriggered: false, adjacentCells: []},
        {id: '1_3', hasMine: false, row: 1, col: 3, isFlagged: false, isCleared: false, wasTriggered: false, adjacentCells: []},
        {id: '1_4', hasMine: false, row: 1, col: 4, isFlagged: false, isCleared: false, wasTriggered: false, adjacentCells: []},
        {id: '1_5', hasMine: false, row: 1, col: 5, isFlagged: false, isCleared: false, wasTriggered: false, adjacentCells: []},
        {id: '1_6', hasMine: false, row: 1, col: 6, isFlagged: false, isCleared: false, wasTriggered: false, adjacentCells: []},
    ],[
        {id: '2_0', hasMine: true, row: 2, col: 0, isFlagged: true, isCleared: false, wasTriggered: false, adjacentCells: []},
        {id: '2_1', hasMine: false, row: 2, col: 1, isFlagged: false, isCleared: false, wasTriggered: false, adjacentCells: []},
        {id: '2_2', hasMine: true, row: 2, col: 2, isFlagged: false, isCleared: false, wasTriggered: false, adjacentCells: []},
        {id: '2_3', hasMine: false, row: 2, col: 3, isFlagged: false, isCleared: false, wasTriggered: false, adjacentCells: []},
        {id: '2_4', hasMine: false, row: 2, col: 4, isFlagged: false, isCleared: false, wasTriggered: false, adjacentCells: []},
        {id: '2_5', hasMine: false, row: 2, col: 5, isFlagged: false, isCleared: false, wasTriggered: false, adjacentCells: []},
        {id: '2_6', hasMine: false, row: 2, col: 6, isFlagged: false, isCleared: false, wasTriggered: false, adjacentCells: []},
    ],[
        {id: '3_0', hasMine: false, row: 3, col: 0, isFlagged: true, isCleared: false, wasTriggered: false, adjacentCells: []},
        {id: '3_1', hasMine: false, row: 3, col: 1, isFlagged: false, isCleared: false, wasTriggered: false, adjacentCells: []},
        {id: '3_2', hasMine: false, row: 3, col: 2, isFlagged: false, isCleared: false, wasTriggered: false, adjacentCells: []},
        {id: '3_3', hasMine: true, row: 3, col: 3, isFlagged: false, isCleared: false, wasTriggered: false, adjacentCells: []},
        {id: '3_4', hasMine: false, row: 3, col: 4, isFlagged: false, isCleared: false, wasTriggered: false, adjacentCells: []},
        {id: '3_5', hasMine: false, row: 3, col: 5, isFlagged: false, isCleared: false, wasTriggered: false, adjacentCells: []},
        {id: '3_6', hasMine: true, row: 3, col: 6, isFlagged: false, isCleared: false, wasTriggered: false, adjacentCells: []},
    ]
];

describe('<Cell />', () => {
    let initialMinefield = {
        gameState: '',
        minefield: setAdjacentCells(defaultMinefield)
    }, 
    initialCell = {}, 
    initialTimer = {
        seconds: 0,
        timerState: 'clear',
    },
    preloadedState = {}
    beforeEach(() => {
        preloadedState = {
            minefield: initialMinefield,
            cell: initialCell,
            timer: initialTimer,
        }
    })
    it('should show a covered, unflagged cell', () => {
        const cell = initialMinefield.minefield[0][0]
        const {container} = renderWithProviders(<Cell props={cell}/>,preloadedState)
        const svg = container.children[0].textContent
        expect(svg).toEqual('BlankSquare.svg')
    })
    it('should show a covered, flagged cell', () => {
        const cell = initialMinefield.minefield[1][2]
        preloadedState.minefield.minefield[1][2].isFlagged = true
        const {container} = renderWithProviders(<Cell props={cell}/>,preloadedState)
        const svg = container.children[0].textContent
        expect(svg).toEqual('FlagSquare.svg')
    })
    it('should show a cleared cell, with value 0', () => {
        const cell = initialMinefield.minefield[0][0]
        preloadedState.minefield.minefield[0][0].isCleared = true
        const {container} = renderWithProviders(<Cell props={cell}/>,preloadedState)
        const svg = container.children[0].textContent
        expect(svg).toEqual('0')
    })
    it('should show a triggered mine', () => {
        const cell = initialMinefield.minefield[1][2]
        preloadedState.minefield.minefield[1][2].isCleared = true
        preloadedState.minefield.minefield[1][2].wasTriggered = true
        preloadedState.minefield.minefield[1][2].isFlagged = false
        const {container} = renderWithProviders(<Cell props={cell}/>,preloadedState)
        const svg = container.children[0].textContent
        expect(svg).toEqual('TriggeredBomb.svg')
    })
    it('should show a non-triggered mine', () => {
        const cell = initialMinefield.minefield[1][2]
        preloadedState.minefield.minefield[1][2].isCleared = true
        preloadedState.minefield.minefield[1][2].wasTriggered = false
        preloadedState.minefield.minefield[1][2].isFlagged = true
        const {container} = renderWithProviders(<Cell props={cell}/>,preloadedState)
        const svg = container.children[0].textContent
        expect(svg).toEqual('Bomb.svg')
    })
    it('should show a false flag square', () => {
        const cell = initialMinefield.minefield[0][0]
        preloadedState.minefield.minefield[0][0].isCleared = true
        preloadedState.minefield.minefield[0][0].wasTriggered = false
        preloadedState.minefield.minefield[0][0].isFlagged = true
        const {container} = renderWithProviders(<Cell props={cell}/>,preloadedState)
        const svg = container.children[0].textContent
        expect(svg).toEqual('FalseFlag.svg')
    })
})

describe('Cell events', () => {
    let initialMinefield = {
        gameState: '',
        minefield: setAdjacentCells(defaultMinefield)
    }, 
    initialCell = {}, 
    initialTimer = {
        seconds: 0,
        timerState: 'clear',
    },
    preloadedState = {}
    describe('game is not in progress', () => {
        beforeEach(() => {
            preloadedState = {
                minefield: initialMinefield,
                cell: initialCell,
                timer: initialTimer,
            }
        })
        it('should dispatch generateMineField(), clearCell(), and setTimerState()', () => {
            const cell = initialMinefield.minefield[0][0]
            const {container, store} = renderWithProviders(<Cell props={{cell}} />, preloadedState)
            // fireEvent()
            console.log('here');
        })
    })
})