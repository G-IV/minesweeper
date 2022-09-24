import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
    selectSeconds, 
    setSeconds, 
    incrementSeconds, 
    selectTimerState
} from "./timerSlice";

import timerStyling from './Timer.module.css'

export default function Timer(){
    const dispatch = useDispatch()

    let seconds = useSelector(selectSeconds)
    let timerState = useSelector(selectTimerState)

    const [timer, setTimer] = useState(null)

    const startTimer = () => {
        const newTimer = setInterval(() => {
            dispatch(incrementSeconds())
        }, 1000)
        setTimer(newTimer)
    }

    const stopTimer = () => {
        if(!!timer){
            clearInterval(timer)
            setTimer(null)
        }
    }

    useEffect(() => {
        if (seconds >= 999) {
            stopTimer()
        }
    }, [seconds])

    useEffect(() => {
        switch (timerState) {
            case 'clear':
                stopTimer()
                dispatch(setSeconds(0))
                break;
            case 'stop':
                stopTimer()
                break;
            default:
                startTimer()
                dispatch(setSeconds(0))
                break;
        }
    }, [timerState])

    return (
        <div className={timerStyling.timer}>
            {seconds}
        </div>
    )
}