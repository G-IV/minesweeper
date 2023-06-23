import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ReactComponent as BlankSquare } from '../../assets/BlankSquare.svg'
import { ReactComponent as FlagSquare } from '../../assets/FlagSquare.svg'
import { ReactComponent as Bomb } from '../../assets/Bomb.svg'
import { ReactComponent as FalseFlag } from '../../assets/FalseFlag.svg'
import { ReactComponent as TriggeredBomb } from '../../assets/TriggeredBomb.svg'

import cellStyles from './Cell.module.css'

import { 
    selectMineField,
    updateCell,
    clearNearbyCells,
    generateMineField,
    clearCell,
    exposeMines,
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
    const [mineTriggered, setMineTriggered] = useState(false)

    let minefield = useSelector(selectMineField)

    useEffect(() => {
        setAdjMineCount(props.adjacentCells.filter((cell) => cell.hasMine).length)
    }, [props])

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
        return !props.isCleared && !props.isFlagged
    }

    const isCellRightClickable = () => {
        return !props.isCleared
    }

    const mouseUp = (e) => {
        if(isDualClick()){
            // Does flag qty of adjacent cells === mine qty?
                // If yes, do flags match mines
                    // If no, expose mines + styling
                    // If yes, clearNearbyCells
            dispatch(clearNearbyCells(props))
        }
        else if (isLeftClick() && isCellLeftClickable()){
            if (isGameActive(minefield)) {
                if (props.hasMine) {
                    setMineTriggered(true)
                    dispatch(exposeMines(props))
                    dispatch(setTimerState('stop'))
                } else {
                    dispatch(clearCell(props))
                }
            } else {
                dispatch(generateMineField(
                    {count: 99, rows: 16, columns: 30, cell: {row: props.row, col: props.col}}
                ))
                dispatch(clearCell(props))
                dispatch(setTimerState('newGame'))
            }
        }
        else if (isRightClick() && isCellRightClickable()){
            dispatch(updateCell({row: props.row, col: props.col, updates:[{key: 'isFlagged', val: !props.isFlagged}]}))
        }

        if(e.button === 0){
            setLeftMouse(false)
        } else if (e.button === 2) {
            setRightMouse(false)
        }
    }

    const showBlankCell = () => {
        return !props.isCleared && !props.isFlagged
    }

    const showFlaggedCell = () => {
        return !props.isCleared && props.isFlagged
    }

    const showTriggeredBomb = () => {
        return props.isCleared && props.hasMine && props.wasTriggered
    }

    const showFalseFlag = () => {
        return props.isCleared && !props.hasMine && props.isFlagged
    }

    const showBomb = () => {
        return props.isCleared && props.hasMine && !props.wasTriggered && !props.hadFalseFlag
    }

    const showAdjacentCount = () => {
        return props.isCleared && !props.hasMine
    }

    const getCellElement = () => {
        console.log('getCellElement', props.id);
        if (showBlankCell()) {
            return (<BlankSquare className={`${cellStyles.square}`} key={props.id}/>)
        } 
        if(showFlaggedCell()) {
            return (<FlagSquare className={`${cellStyles.square}`} key={props.id}/>)
        } 
        if (showTriggeredBomb()){
            return (<TriggeredBomb className={`${cellStyles.square}`} key={props.id}/>)
        } 
        if (showFalseFlag()){
            return (<FalseFlag className={`${cellStyles.square}`} key={props.id}/>)
        } 
        if (showBomb()){
            return (<Bomb className={`${cellStyles.square}`} key={props.id}/>)
        } 
        if (showAdjacentCount()){
            return ( <div className={`${cellStyles[`mineCount_${adjMineCount}`]} ${cellStyles['mineCount']}`}>{adjMineCount}</div>)
        }
    }

    return (
        <div 
            className={`${cellStyles.square} cell-${props.id}`}
            role="cell"
            onContextMenu={(e) => {e.preventDefault()}} 
            onMouseDown={mouseDown}
            onMouseUp={mouseUp}
        >
            { getCellElement() }
        </div>
    )
}