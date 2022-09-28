import React, {} from "react";

import Digit from "./digit/digit";
import displayStyles from './display.module.css'

export default function Display({props}){
    const createDigit = () => {
        return String(props.val).padStart(props.max,'0').split('')
    }
    return (
        <div className={displayStyles.display}>
            {createDigit().map((digit, i) => {
                return <div className="digit" key={`digitID_${i}`}>
                    <Digit props={{val: digit}}/>
                </div>
            })}
        </div>
    )
}