import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { ReactComponent as BlankSquare } from '../../assets/BlankSquare.svg'
import { ReactComponent as FlagSquare } from '../../assets/FlagSquare.svg'
// import { ReactComponent as Bomb } from '../../assets/Bomb.svg'

import cellStyles from './Cell.module.css'

import { 
    selectMineField,
    updateAdjacentCells,
    updateCell
} from "../minefield/minefieldSlice";
import { 
    selectRow, 
    selectCol, 
    selectAdjacentMineCount, 
    selectHasMine, 
    initCell
} from "./cellSlice";

export default function Cell({props}){
    let dispatch = useDispatch()

    let minefield = useSelector(selectMineField)
    let row = useSelector(selectRow)
    let col = useSelector(selectCol)
    let adjacentMineCount = useSelector(selectAdjacentMineCount)
    let hasMine = useSelector(selectHasMine)

    useEffect(() => {
        dispatch(updateAdjacentCells(props))
        dispatch(updateCell({
            row: props.row, 
            col: props.col, 
            updates:[{key: 'isCleared', val: false}, {key: 'isFlagged', val: false}]
        }))
        dispatch(initCell({
            row: props.row, col: props.col,
            hasMine: minefield[props.row][props.col].hasMine,
            adjacentMineCount: minefield[props.row][props.col].adjacentCells.length
        }))
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