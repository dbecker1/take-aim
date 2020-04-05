import React from 'react';
import ShotDetector from "../../util/ShotDetector"
import {Button, Form} from "react-bootstrap";
import cookie from 'react-cookies'
import ReactGA from 'react-ga';
import { connect } from "react-redux";
import { addShot, wipeShots } from "../../app/slices/shotSlice";
import { bindActionCreators } from "redux";

class ShotFeed extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            running: false
        }

        this.canvasRef = React.createRef();
        this.canvasParentRef = React.createRef();
    }

    updateNoise(e) {
        let checked = e.target.checked;
        this.shotDetector.filterNoise = checked;
    }

    startProcessing() {
        this.props.wipeShots();
        this.setState({
            running: true
        }, () => {
            const outputDimensions = {
                rows: this.props.targetScreenManager.canvas.height,
                columns: this.props.targetScreenManager.canvas.width
            }
            if (!this.shotDetector) {
                const laserConfig = cookie.load("laserConfig")
                if (laserConfig === null){
                    console.error("Missing laser config")
                    return;
                }
                const webcamConfig = cookie.load("webcamConfig")
                if (webcamConfig === null) {
                    console.error("Missing webcam config");
                }
                this.shotDetector = new ShotDetector(this.props.videoRef.current, laserConfig.h, laserConfig.s, laserConfig.v,
                    laserConfig.hRadius, laserConfig.sRadius, laserConfig.vRadius, webcamConfig.corners,
                    outputDimensions, 200);
            }

            const parentWidth = this.canvasParentRef.current.offsetWidth * .9;
            const windowHeight = window.innerHeight * .6;
            let scaleColumns = parentWidth / outputDimensions.columns
            let scaleRows = windowHeight / outputDimensions.rows
            if (scaleRows < scaleColumns) {
                scaleColumns = scaleRows
            } else {
                scaleRows = scaleColumns
            }
            const canvas = this.canvasRef.current;
            canvas.width = outputDimensions.columns * scaleColumns;
            canvas.height = outputDimensions.rows * scaleRows;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(this.props.targetScreenManager.canvas, 0, 0, canvas.width, canvas.height);
            this.shotDetector.start((hit => {
                ReactGA.event({
                    category: 'Shot Feed',
                    action: "Shot Detected",
                    label: "Radius: " + hit.radius
                });
                if (!!this.props.onHit) {
                    this.props.onHit(hit);
                }
                this.props.addShot(hit);
                console.log(hit)
                ctx.beginPath();
                ctx.arc(hit.center.x * scaleColumns, hit.center.y * scaleRows, 5, 0, 2*Math.PI, false)
                ctx.lineWidth = 5;
                ctx.strokeStyle = 'red';
                ctx.stroke();
            }))
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

const mapDispatchToProps = dispatch => {
    return bindActionCreators({addShot, wipeShots}, dispatch)
};

export default connect(null, mapDispatchToProps, null, {forwardRef: true})(ShotFeed);
