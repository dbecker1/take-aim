import React from 'react';

const Bullseye = ({x=0, y=0, width=251, height=251, targetId= null}) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 251 251" x={x} y={y} width={width} height={height}>
            <g id="Bullseye" data-target-id={targetId}>
                <path id="_4-ring" data-name="4-ring" style={{stroke: "#000", strokeMiterlimit: 10, fill: "#000"}}
                      d="M250.5,125.5A125,125,0,1,1,125.5.5,125,125,0,0,1,250.5,125.5Z"/>
                <path id="_6-ring" data-name="6-ring" style={{stroke: "#000", strokeMiterlimit: 10, fill: "#0071bc"}}
                      d="M225.5,125.5a100,100,0,1,1-100-100A100,100,0,0,1,225.5,125.5Z"/>
                <path id="_8-ring" data-name="8-ring" style={{stroke: "#000", strokeMiterlimit: 10, fill: "red"}}
                      d="M200.5,125.5a75,75,0,1,1-75-75A75,75,0,0,1,200.5,125.5Z"/>
                <path id="_10-ring" data-name="10-ring" style={{stroke: "#000", strokeMiterlimit: 10, fill: "#ff0"}}
                      d="M175.5,125.5a50,50,0,1,1-50-50A50,50,0,0,1,175.5,125.5Z"/>
            </g>
        </svg>
    )
}

export default Bullseye