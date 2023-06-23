import React from "react";
import { screen } from "@testing-library/react";
import { renderWithProviders } from '../../utils/test-utils';

import user from "@testing-library/user-event";

import Cell from "./Cell";
import { copyMinefield, getAdjacentCells } from "../../hooks/minefield";
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
    let initialCell = {}, 
    initialTimer = {
        seconds: 0,
        timerState: 'clear',
    },
    preloadedState = {}
    beforeEach(() => {
        preloadedState = {
            cell: initialCell,
            minefield: setAdjacentCells(copyMinefield(defaultMinefield)),
            timer: initialTimer,
        }
    })
    it('should show a covered, unflagged cell', () => {
        const cell = preloadedState.minefield[0][0]
        renderWithProviders(<Cell props={cell}/>, preloadedState)
        const svg = screen.queryByText('BlankSquare.svg')
        expect(svg).toBeInTheDocument()
    })
    it('should show a covered, flagged cell', () => {
        const cell = preloadedState.minefield[1][2]
        preloadedState.minefield[1][2].isFlagged = true
        renderWithProviders(<Cell props={cell}/>, preloadedState)
        const svg = screen.queryByText('FlagSquare.svg')
        expect(svg).toBeInTheDocument()
    })
    it('should show a cleared cell, with value 0', () => {
        const cell = preloadedState.minefield[0][0]
        preloadedState.minefield[0][0].isCleared = true
        renderWithProviders(<Cell props={cell}/>, preloadedState)
        const svg = screen.queryByText('0')
        expect(svg).toBeInTheDocument()
    })
    it('should show a triggered mine', () => {
        const cell = preloadedState.minefield[1][2]
        preloadedState.minefield[1][2].isCleared = true
        preloadedState.minefield[1][2].wasTriggered = true
        preloadedState.minefield[1][2].isFlagged = false
        renderWithProviders(<Cell props={cell}/>, preloadedState)
        const svg = screen.queryByText('TriggeredBomb.svg')
        expect(svg).toBeInTheDocument()
    })
    it('should show a non-triggered mine', () => {
        const cell = preloadedState.minefield[1][2]
        preloadedState.minefield[1][2].isCleared = true
        preloadedState.minefield[1][2].wasTriggered = false
        preloadedState.minefield[1][2].isFlagged = true
        renderWithProviders(<Cell props={cell}/>, preloadedState)
        const svg = screen.queryByText('Bomb.svg')
        expect(svg).toBeInTheDocument()
    })
    it('should show a false flag square', () => {
        const cell = preloadedState.minefield[0][0]
        preloadedState.minefield[0][0].isCleared = true
        preloadedState.minefield[0][0].wasTriggered = false
        preloadedState.minefield[0][0].isFlagged = true
        renderWithProviders(<Cell props={cell}/>, preloadedState)
        const svg = screen.queryByText('FalseFlag.svg')
        expect(svg).toBeInTheDocument()
    })
});

describe('Flagged cell', () => {
    let initialCell = {}, 
    initialTimer = {
        seconds: 0,
        timerState: 'clear',
    },
    preloadedState = {}
    beforeEach(() => {
        preloadedState = {
            cell: initialCell,
            minefield: setAdjacentCells(copyMinefield(defaultMinefield)),
            timer: initialTimer,
        }
    })
    it('Should register clicks', async () => {
        user.setup()
        const cell = preloadedState.minefield[1][2]

        // Render the component
        renderWithProviders(<Cell props={cell} />, preloadedState)

        // Get the cell & details of the cell
        const cellUnderTest = screen.getByRole('cell')

        // Click the cell
        await user.pointer({keys: '[MouseLeft]', target: cellUnderTest})

        // Validate the cell has been clicked
        const flaggedSvg = await screen.findByText('FlagSquare.svg')
        expect(flaggedSvg).toBeInTheDocument()
        // expect(cellUnderTest).toHaveTextContent('1')

    })
})