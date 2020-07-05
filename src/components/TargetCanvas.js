import React from "react";
import {connect} from "react-redux";
import '../styles/TargetCanvas.css';
import {all_targets} from "./mainScreen/shootingModes/targets"
import {all_non_targets} from "./mainScreen/shootingModes/nonTargets";


class TargetCanvas extends React.Component{
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
    }

    onCanvasClick(e) {
        if (!this.props.onClick) {
            return;
        }
        let rect = this.canvasRef.current.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        this.props.onClick({
            x: x,
            y: y
        })
    }

    render() {
        let scaleFactor = this.props.hasOwnProperty("scaleFactor") ? this.props.scaleFactor: 1.0
        let shotMode = this.props.hasOwnProperty("shotMode") ? this.props.shotMode : "none";
        return (
            <svg
                viewBox={`0 0 ${this.props.canvasDimensions.width} 
                ${this.props.canvasDimensions.height}`}
                style={{backgroundColor: "white"}}
                width={this.props.canvasDimensions.width * scaleFactor}
                height={this.props.canvasDimensions.height * scaleFactor}
                onClick={(e) => {this.onCanvasClick(e)}}
                ref={this.canvasRef}>
                {this.props.targets.map((value, index) => {
                    const TargetComponent = all_targets.filter(a => {return a.name === value.name})[0].component
                    return <TargetComponent
                        x={value.x}
                        y={value.y}
                        width={value.width}
                        height={value.height}
                        key={index}/>
                })}
                {this.props.nonTargetElements.map((value, index) => {
                    if (value.type === "text") {
                        return (
                            <text x={value.left} y={value.top} width={value.width} height={value.height} key={index}>{value.text}</text>
                        )
                    } else if (value.type === "svg") {
                        const NonTargetComponent = all_non_targets.filter(a => {return a.name === value.name})[0].component
                        return <NonTargetComponent x={value.x} y={value.y} width={value.width} height={value.height} />
                    } else if (value.type === "rect") {
                        return <rect x={value.x} y={value.y} width={value.width} height={value.height} fill={value.fill} />
                    }
                    return null;
                })}
                {this.props.shots.map((value, index) => {
                    if (shotMode === "standard") {
                        return <circle cx={value.center.x} cy={value.center.y} r={3} style={{fill: "red"}} />
                    } else if (shotMode === "fade") {
                        return <circle cx={value.center.x}
                                       cy={value.center.y}
                                       r={5}
                                       style={{fill: "black", animationName: "fadeShot", animationDuration: "3s", animationFillMode: "forwards"}} />
                    }
                    return null;
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
    targets: state.targets,
    shots: state.shotTracker.shots
})

export default connect(mapStateToProps)(TargetCanvas)