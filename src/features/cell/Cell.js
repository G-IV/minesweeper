import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ReactComponent as BlankSquare } from '../../assets/BlankSquare.svg'
import { ReactComponent as FlagSquare } from '../../assets/FlagSquare.svg'
// import { ReactComponent as Bomb } from '../../assets/Bomb.svg'

import cellStyles from './Cell.module.css'

import { selectMineField, updateMinefield } from "../minefield/minefieldSlice";

export default function Cell({props}){
    let dispatch = useDispatch()

    let minefield = useSelector(selectMineField)
    
    const getOffset = (index) => {
        var row = props.row + ([0,1,2].includes(index) ? -1 : [3,4].includes(index) ? 0 : 1)
        var col = props.col + ([0,3,5].includes(index) ? -1 : [1,6].includes(index) ? 0 : 1)
        return {row, col} 
    }

    const getOffsetValue = (offset) => {
        if (offset.row > -1 && offset.row < minefield.length && offset.col > -1 && offset.col < minefield[0].length) {
            return minefield[offset.row][offset.col].val
        }
        return null
    }

    useEffect(() => {
        const touching = Array(8).fill().map((elem, index) => {
            const offset = getOffset(index)
            const val = getOffsetValue(offset)
            return {row: offset.row, col: offset.col, val}
        }).filter((adjField) => adjField.val !== null)
    }, [])

    return (
        <div className={`${cellStyles.square}`}>
            {minefield.isCleared && <div className='uncovered'>
                {/* {props.val === 1 ? <Bomb  className={`${cellStyles.square}`}/> : <div>{adjacentMinesCount()}</div>} */}
            </div>}
            {!minefield.isCleared && !minefield.isFlagged && <BlankSquare className={`${cellStyles.square}`} key={props.id} />}
            {!minefield.isCleared && minefield.isFlagged && <FlagSquare className={`${cellStyles.square}`} key={props.id} />}
        </div>
    )
}