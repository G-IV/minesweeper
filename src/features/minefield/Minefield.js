import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Cell from "../cell/Cell";

// Styling
import minefieldStyles from './Minefield.module.css';
import { selectMineField, generateMineField } from './minefieldSlice.js';

export default function Minefield(){
    const dispatch = useDispatch();
    const minefield = useSelector(selectMineField);
    useEffect(() => {
        dispatch(generateMineField({count: 2, rows: 2, columns: 3}))
    }, [dispatch])
    return ( 
        <>
            <div className="game-controls">
                {/* This is where the remaining uncovered mine count, game reset, and elapsed time indicator will go. I will likely make this a separate component */}
            </div>
            <div className={minefieldStyles.gameGrid}>
                {
                    minefield.map((row) =>(
                        <div className={`${minefieldStyles.minefieldRow}`} key={`row_${row[0].row}`}>
                            {row.map((cell) => (
                                <div className={`cell`} key={`${cell.id}`}><Cell props={cell}/></div>
                            ))}
                        </div>
                    ))
                }
            </div>
        </>
    )
}