import React from "react";
import {connect} from "react-redux";
import '../../styles/TargetCanvas.css';
import {all_targets} from "../mainScreen/shootingModes/targets"


class TargetCanvas extends React.Component{

    render() {
        let scaleFactor = this.props.hasOwnProperty("scaleFactor") ? this.props.scaleFactor: 1.0
        let targets = []
        this.props.targets.forEach(target_obj => {
            let target = {...target_obj}
            target.component = all_targets.filter(a => {return a.name === target.name})[0].component
            targets.push(target);
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
                        x={value.x * scaleFactor}
                        y={value.y * scaleFactor}
                        width={value.width * scaleFactor}
                        height={value.height * scaleFactor} />
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