import React from 'react';

const TreePlate = ({x=0, y=0, width=69, height=59, targetId= null}) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 69 59" x={x} y={y} width={width} height={height}>
            <g id="DuelingTreeBase" data-target-id={targetId}>
                <path data-name="plate" style={{fill: "#ccc", stroke: "#ccc", strokeMiterlimit: 10}} d="M68.5,17.5v25H55.42a29,29,0,1,1,.48-25Z"/>
            </g>
        </svg>
    )
}

export default TreePlate