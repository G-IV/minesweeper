import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import controlsStyling from './Controls.module.css';
import { generateMineField, selectMineField } from '../minefield/minefieldSlice';

import Timer from "../timer/Timer";
import Display from "../display/display";
import { setTimerState } from "../timer/timerSlice";

export default function Controls(){
    const dispatch = useDispatch()

    const minefield = useSelector(selectMineField)

    const [mineCount, setMineCount] = useState(0)
    const [flagCount, setFlagCount] = useState(0)

    useEffect(() => {
        if(minefield.length > 0){
            setMineCount(minefield.flat().map((cell) => cell.hasMine ? 1 : 0).reduce((prev, curr) => prev + curr))
            setFlagCount(minefield.flat().map((cell) => cell.isFlagged ? 1 : 0).reduce((prev, curr) => prev + curr))
        } else {
            setMineCount(0)
            setFlagCount(0)
        }
    }, [minefield])

    const resetGame = () => {
        dispatch(generateMineField())
        dispatch(setTimerState('clear'))
    }

    return (
        <div className={controlsStyling.gameControls}>
            <div className={controlsStyling.mineCount}>
                <Display props={{val: mineCount - flagCount, max: 3}} />
            </div>
            <div className="gameReset">
                <button onClick={resetGame}>Reset</button>
            </div>
            <Timer />
        </div>
    )
}