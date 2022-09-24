import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ReactComponent as BlankSquare } from '../../assets/BlankSquare.svg'
import { ReactComponent as FlagSquare } from '../../assets/FlagSquare.svg'
import { ReactComponent as Bomb } from '../../assets/Bomb.svg'

import cellStyles from './Cell.module.css'

import { 
    selectMineField,
    updateCell,
    clearAdjacentCells,
    generateMineField,
    clearCell,
} from "../minefield/minefieldSlice";

import {
    isGameActive,
} from '../../hooks/minefield'
import { setTimerState } from "../timer/timerSlice";

export default function Cell({props}){
    let dispatch = useDispatch()
    
    const [leftMouse, setLeftMouse] = useState(false)
    const [rightMouse, setRightMouse] = useState(false)
    const [adjMineCount, setAdjMineCount] = useState([])
    const [cell, setCell] = useState({})

    let minefield = useSelector(selectMineField)

    useEffect(() => {
        setAdjMineCount(minefield[props.row][props.col].adjacentCells.filter((cell) => cell.hasMine).length)
        setCell({...minefield[props.row][props.col]})
    }, [minefield, props])

    // Mouse Actions
    const mouseDown = (e) => {
        if(e.button === 0){
            setLeftMouse(true)
        } else if (e.button === 2) {
            setRightMouse(true)
        }
    }

    const isDualClick = () => {
        return leftMouse && rightMouse
    }

    const isLeftClick = () => {
        return leftMouse && !rightMouse
    }

    const isRightClick = () => {
        return !leftMouse && rightMouse
    }

    const isCellLeftClickable = () => {
        return !cell.isCleared && !cell.isFlagged
    }

    const isCellRightClickable = () => {
        return !cell.isCleared
    }

    const mouseUp = (e) => {
        if(isDualClick()){
            dispatch(clearAdjacentCells(props))
        }
        else if (isLeftClick() && isCellLeftClickable()){
            if (isGameActive(minefield)) {
                dispatch(clearCell(props))
            } else {
                dispatch(generateMineField(
                    {count: 99, rows: 16, columns: 30, cell: {row: props.row, col: props.col}}
                ))
                dispatch(clearCell(props))
                dispatch(setTimerState('newGame'))
            }
        }
        else if (isRightClick() && isCellRightClickable()){
            dispatch(updateCell({row: cell.row, col: cell.col, updates:[{key: 'isFlagged', val: !cell.isFlagged}]}))
        }

        if(e.button === 0){
            setLeftMouse(false)
        } else if (e.button === 2) {
            setRightMouse(false)
        }
    }

    return (
        <div className={`${cellStyles.square}`} onContextMenu={(e) => {e.preventDefault()}} onMouseDown={mouseDown} onMouseUp={mouseUp}>
            {minefield[props.row][props.col].isCleared && <div className='uncovered'>
                {props.hasMine ? 
                    <Bomb className={`${cellStyles.square}`}/> : <div 
                    className={`${cellStyles[`mineCount_${adjMineCount}`]} ${cellStyles['mineCount']}`}>
                        {adjMineCount}
                    </div>
                }
            </div>}
            {!minefield[props.row][props.col].isCleared && !minefield[props.row][props.col].isFlagged && 
                <BlankSquare className={`${cellStyles.square}`} key={props.id}/>
            }
            {!minefield[props.row][props.col].isCleared && minefield[props.row][props.col].isFlagged && 
                <FlagSquare className={`${cellStyles.square}`} key={props.id}/>
            }
        </div>
    )
}