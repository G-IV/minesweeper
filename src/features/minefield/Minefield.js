import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

// Styling
import minefieldStyles from './Minefield.module.css';
import { selectMineField, generateMineField } from './minefieldSlice';

export default function Minefield(){
    const dispatch = useDispatch();
    const minefield = useSelector(selectMineField);
    useEffect(() => {
        dispatch(generateMineField())
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
                            {row.map((pavlov) => (
                                // <div className={`pavlov`} key={`${pavlov.id}`}><Cell props={pavlov}/></div>
                                <div className={`pavlov`} key={`${pavlov.id}`}>{pavlov.val}</div>
                            ))}
                        </div>
                    ))
                }
            </div>
        </>
    )
}