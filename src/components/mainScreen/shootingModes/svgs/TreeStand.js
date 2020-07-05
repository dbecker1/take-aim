import React from 'react';

const TreeStand = ({x=0, y=0, width=140, height=486.5}) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 486.5" x={x} y={y} width={width} height={height}>
            <defs>
            </defs>
            <g id="DuelingTreeBase">
                <polygon style={{fill: "#666", stroke: "#000", strokeMiterlimit: 10}}
                         points="81 0.5 81 454.52 74.33 454.52 74.33 486 65.43 486 65.43 454.52 59.5 454.52 59.5 0.5 81 0.5"/>
                <rect style={{fill: "#666", stroke: "#000", strokeMiterlimit: 10}} x="0.5" y="480.28" width="139" height="5.72"/>
            </g>
        </svg>
    )
}

export default TreeStand