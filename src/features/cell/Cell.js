import React from "react";
import { useSelector } from "react-redux/es/exports";

import { ReactComponent as BlankSquare } from '../../assets/BlankSquare.svg'
import { ReactComponent as FlagSquare } from '../../assets/FlagSquare.svg'
// import { ReactComponent as Bomb } from '../../assets/Bomb.svg'

import cellStyles from './Cell.module.css'

import { selectMineField } from "../minefield/minefieldSlice";

export default function Cell({props}){
    let minefield = useSelector(selectMineField)
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