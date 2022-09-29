import React from "react";

export default function Digit({props}){
    return (
        <div className="digit" key={props.key}>
            {props ? props.val : ''}
        </div>
    )
}