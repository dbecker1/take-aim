import React from "react";
import {connect} from "react-redux";
import '../styles/TargetCanvas.css';
import {all_targets} from "./mainScreen/shootingModes/targets"
import {all_non_targets} from "./mainScreen/shootingModes/nonTargets";


class TargetCanvas extends React.Component{
    render() {
        let scaleFactor = this.props.hasOwnProperty("scaleFactor") ? this.props.scaleFactor: 1.0
        let targets = []
        this.props.targets.forEach(target_obj => {
            let target = {...target_obj}
            target.component = all_targets.filter(a => {return a.name === target.name})[0].component
            targets.push(target);
        })
        let nonTargets = []
        this.props.nonTargetElements.forEach(non_target_obj => {
            // handle loading of svgs here
            nonTargets.push({...non_target_obj})
        })
        return (
            <svg
                viewBox={`0 0 ${this.props.canvasDimensions.width} 
                ${this.props.canvasDimensions.height}`}
                style={{backgroundColor: "white"}}
                width={this.props.canvasDimensions.width * scaleFactor}
                height={this.props.canvasDimensions.height * scaleFactor}>
                {targets.map((value, index) => {
                    const TargetComponent = value.component;
                    return <TargetComponent
                        x={value.x}
                        y={value.y}
                        width={value.width}
                        height={value.height}
                        key={index}/>
                })}
                {nonTargets.map((value, index) => {
                    if (value.type === "text") {
                        return (
                            <text x={value.left} y={value.top} width={value.width} height={value.height} key={index}>{value.text}</text>
                        )
                    } else if (value.type === "svg") {
                        const NonTargetComponent = all_non_targets.filter(a => {return a.name === value.name})[0].component
                        return <NonTargetComponent x={value.x} y={value.y} width={value.width} height={value.height} />
                    }
                })}
            </svg>
        )
    }
}

const mapStateToProps  = state => ({
    canvasDimensions: {
        height: state.projector.canvasHeight,
        width: state.projector.canvasWidth
    },
    nonTargetElements: state.projector.nonTargetElements,
    targets: state.targets
})

export default connect(mapStateToProps)(TargetCanvas)