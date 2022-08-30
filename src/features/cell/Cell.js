import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ReactComponent as BlankSquare } from '../../assets/BlankSquare.svg'
import { ReactComponent as FlagSquare } from '../../assets/FlagSquare.svg'
import { ReactComponent as Bomb } from '../../assets/Bomb.svg'

import cellStyles from './Cell.module.css'

import { 
    selectMineField,
    updateAdjacentCells,
    updateCell,
    clearCell
} from "../minefield/minefieldSlice";

export default function Cell({props}){
    let dispatch = useDispatch()
    
    const [leftMouse, setLeftMouse] = useState(false)
    const [rightMouse, setRightMouse] = useState(false)
    const [adjMineCount, setAdjMineCount] = useState([])

    let minefield = useSelector(selectMineField)

    useEffect(() => {
        dispatch(updateAdjacentCells(props))
        dispatch(updateCell({
            row: props.row, 
            col: props.col, 
            updates:[{key: 'isCleared', val: false}, {key: 'isFlagged', val: false}]
        }))
    }, [])

    useEffect(() => {
        setAdjMineCount(minefield[props.row][props.col].adjacentCells.filter((cell) => cell.hasMine).length)
    }, [minefield])

    // Mouse Actions
    const mouseDown = (e) => {
        if(e.button === 0){
            setLeftMouse(true)
        } else if (e.button === 2) {
            setRightMouse(true)
        }
    }

    const mouseUp = (e) => {
        if(e.button === 0){
            setLeftMouse(false)
        } else if (e.button === 2) {
            setRightMouse(false)
        }
    }

    const cellCleared = (e) => {
        dispatch(clearCell(props))
    }

    const flagCell = (e) => {
        e.preventDefault()
        let flagged = minefield[props.row][props.col].isFlagged
        dispatch(updateCell({row: props.row, col: props.col, updates:[{key: 'isFlagged', val: !flagged}]}))
    }

    return (
        <div className={`${cellStyles.square}`}>
            {minefield[props.row][props.col].isCleared && <div className='uncovered'>
                {props.hasMine ? 
                    <Bomb  className={`${cellStyles.square}`}/> : <div>{adjMineCount}</div>
                }
            </div>}
            {!minefield[props.row][props.col].isCleared && !minefield[props.row][props.col].isFlagged && 
                <BlankSquare className={`${cellStyles.square}`} key={props.id} onClick={cellCleared} onContextMenu={flagCell}/>
            }
            {!minefield[props.row][props.col].isCleared && minefield[props.row][props.col].isFlagged && 
                <FlagSquare className={`${cellStyles.square}`} key={props.id} onContextMenu={flagCell}/>
            }
        </div>
    )
}