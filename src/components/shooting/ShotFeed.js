import React from 'react';
import ShotDetector from "../../util/ShotDetector"
import {Button, Form} from "react-bootstrap";
import cookie from 'react-cookies'
import ReactGA from 'react-ga';
import { connect } from "react-redux";
import { addShot, wipeShots } from "../../app/slices/shotSlice";
import { bindActionCreators } from "redux";
import "../../styles/TargetCanvas.css";

class ShotFeed extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            running: false
        }

        this.canvasRef = React.createRef();
        this.canvasParentRef = React.createRef();

    }

    componentDidMount() {
        this.startProcessing();
    }

    componentWillUnmount() {
        if (!!this.shotDetector) {
            this.shotDetector.stop();
        }
    }

    updateNoise(e) {
        let checked = e.target.checked;
        this.shotDetector.filterNoise = checked;
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.redrawCanvas(nextProps)
    }

    startProcessing() {
        this.props.wipeShots();
        this.setState({
            running: true
        }, () => {
            const laserConfig = cookie.load("laserConfig")
            if (laserConfig === null){
                console.error("Missing laser config")
            }
            const webcamConfig = cookie.load("webcamConfig")
            if (webcamConfig === null) {
                console.error("Missing webcam config");
            }
            const outputDimensions = this.props.outputDimensions
            if (!this.shotDetector) {
                this.shotDetector = new ShotDetector(this.props.videoRef.current, laserConfig.h, laserConfig.s, laserConfig.v,
                    laserConfig.hRadius, laserConfig.sRadius, laserConfig.vRadius, webcamConfig.corners,
                    outputDimensions, 200);
            }
            this.shotDetector.start((hit => {
                ReactGA.event({
                    category: 'Shot Feed',
                    action: "Shot Detected",
                    label: "Radius: " + hit.radius
                });
                this.props.addShot(hit);
                console.log(hit)
            }))
            const parentWidth = this.canvasParentRef.current.offsetWidth * .9;
            const windowHeight = window.innerHeight * .6;
            let scaleColumns = parentWidth / outputDimensions.columns
            let scaleRows = windowHeight / outputDimensions.rows
            if (scaleRows < scaleColumns) {
                scaleColumns = scaleRows
            } else {
                scaleRows = scaleColumns
            }
            this.scale = scaleRows;
            this.canvasRef.current.width = outputDimensions.columns * scaleColumns;
            this.canvasRef.current.height = outputDimensions.rows * scaleRows;
            this.canvas = new window.fabric.Canvas(this.canvasRef.current);
            this.canvas.setZoom(this.scale)
            this.redrawCanvas(this.props)
        })
    }

    redrawCanvas(props)  {
        if (!this.canvas) {
            return;
        }
        this.canvas.loadFromJSON(props.fabricObject, () => {
            for (let index in props.shots) {
                const shot = props.shots[index];
                let shotCircle =  new window.fabric.Circle({
                    radius: 5,
                    fill: 'red',
                    top: shot.center.y,
                    left: shot.center.x,
                    originX: 'center',
                    originY: 'center'
                })
                this.canvas.add(shotCircle);
            }
        })

    }

    render() {
        return (
            <div ref={this.canvasParentRef}>
                <div className={"text-center"}>
                    <canvas ref={this.canvasRef}  ></canvas>
                    <br />
                    <Form.Check type="checkbox" label="Filter Noise" onChange={(e) => {this.updateNoise(e)}}/>
                </div>


            </div>
        );
    }
}

const mapStateToProps = state => ({
    outputDimensions: {
        rows: state.projector.canvasHeight,
        columns: state.projector.canvasWidth
    },
    shots: state.shotTracker.shots,
    fabricObject: state.fabric.fabricObject
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({addShot, wipeShots}, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps, null, {forwardRef: true})(ShotFeed);
