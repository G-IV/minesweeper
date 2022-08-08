import React from "react";
import { useDispatch } from "react-redux";

import minefieldStyles from './Minefield.module.css'

export default function Minefield(){
    const dispatch = useDispatch();

    return (
        <>
            <div className="game-controls">
                {/* This is where the remaining uncovered mine count, game reset, and elapsed time indicator will go. I will likely make this a separate component */}
            </div>
            <div className={minefieldStyles.gameGrid}>
            </div>
        </>
    )
}