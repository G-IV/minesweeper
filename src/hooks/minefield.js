export const copyMinefield = (minefield) => {
    return [...minefield.map((row) => 
        [...row.map((cell) => {
            return {...cell}
        })])]
}

export const countMines = (minefield) => {
    return minefield.flat().filter((cell) => cell.hasMine).length
}

export const countClearedCells = (minefield) => {
    return minefield.flat().filter((cell) => cell.isCleared).length
}

export const countNonMinedCells = (minefield) => {
    return minefield.flat().filter((cell) => !cell.hasMine).length
}

export const countFlaggedCells = (minefield) => {
    return minefield.flat().filter((cell) => cell.isFlagged).length
}

export const countAdjacentMines = (cell) => {
    return cell.adjacentCells.filter((adjCell) => adjCell.hasMine).length
}

export const countAdjacentFlags = (cell, minefield) => {
    return cell.adjacentCells.map((adjCell) => minefield[adjCell.row][adjCell.col].isFlagged).filter((isFlagged) => isFlagged).length
}

export const isGameActive = (minefield) => {
    return minefield.flat().filter((cell) => cell.hasMine).length > 0
}

export const getOffsetCoordinate = (cell, index) => {
    /* 
        [0] [1] [2]
        [3] [4] [5]
        [6] [7] [8]
    Where [4] is the center cell that I need to find the adjacent cells for.
    So I generate a 1x9 array, get the keys (this way I generate an array of [0,1,2,...,8])
    I filter out #4 (since that isn't an adjacent cell)
    I use map to return an array of cells based on the index of the adjacent cell.
    */
    var row = cell.row + ([0,1,2].includes(index) ? -1 : [3,5].includes(index) ? 0 : 1)
    var col = cell.col + ([0,3,6].includes(index) ? -1 : [1,7].includes(index) ? 0 : 1)
    return {row, col} 
}

export const getOffsetValue = (cellOffset, mineField) => {
    if (
        cellOffset.row > -1 && 
        cellOffset.row < mineField.length && 
        cellOffset.col > -1 && 
        cellOffset.col < mineField[0].length) {
        return mineField[cellOffset.row][cellOffset.col].hasMine
    }
    return null
}

export const getAdjacentCells = (cell, minefield) => {
    const touching = [...Array(9).keys()].filter((val) => val !== 4).map((elem, index, arr) => {
        const offset = getOffsetCoordinate(cell, elem)
        const hasMine = getOffsetValue(offset, minefield)
        return {row: offset.row, col: offset.col, hasMine: hasMine}
    })
    return touching.filter((adjacentField) => adjacentField.hasMine !== null)
}

export const allCellsCleared = (minefield) => {
    const clearedCellQty = countClearedCells(minefield)
    const nonMinedCellQty = countNonMinedCells(minefield)
    return clearedCellQty === nonMinedCellQty
}

export const exposeAllMines = (minefield) => {
    minefield.forEach((row) => row.forEach((cell) => cell.isCleared = cell.hasMine ? cell.hasMine : cell.isCleared))
    return minefield
}

export const flagAllMines = (minefield) => {
    minefield.forEach((row) => row.forEach((cell) => cell.isFlagged = cell.hasMine ? cell.hasMine : cell.isFlagged))
    return minefield
}

export const clearCellAndSurroudingCells = (cell, minefield) => {
    minefield[cell.row][cell.col].isCleared = true
    if(countAdjacentMines(cell) === 0){
        cell.adjacentCells.filter((adjCell) => !minefield[adjCell.row][adjCell.col].isCleared).forEach((adjCell) => {
            minefield = clearCellAndSurroudingCells(minefield[adjCell.row][adjCell.col], minefield)
        })
    }
    return minefield
}