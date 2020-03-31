import React from 'react';
import ShotDetector from "../util/ShotDetector"
import {Button, Form} from "react-bootstrap";
import cookie from 'react-cookies'

class ShotFeed extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            running: false
        }

        this.canvasRef = React.createRef();
    }

    updateNoise(e) {
        let checked = e.target.checked;
        this.shotDetector.filterNoise = checked;
    }

    startProcessing() {
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

            const scaleRows = .75
            const scaleColumns = .75
            const canvas = this.canvasRef.current;
            canvas.width = outputDimensions.columns * scaleColumns;
            canvas.height = outputDimensions.rows * scaleRows;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(this.props.targetScreenManager.canvas, 0, 0, canvas.width, canvas.height);
            this.shotDetector.start((hit => {
                console.log(hit)
                ctx.beginPath();
                ctx.arc(hit.x * scaleColumns, hit.y * scaleRows, 5, 0, 2*Math.PI, false)
                ctx.lineWidth = 5;
                ctx.strokeStyle = 'red';
                ctx.stroke();
            }))
        })
    }

    render() {
        return (
            <div>
                <div style={{display: this.state.running ? "none" : "inline"}} >
                    <Button onClick={() => {this.startProcessing()}}>Start shooting!</Button>
                </div>
                <div style={{display: this.state.running ? "inline" : "none"}} className={"text-center"}>
                    <canvas ref={this.canvasRef}  ></canvas>
                    <br />
                    <Form.Check type="checkbox" label="Filter Noise" onChange={(e) => {this.updateNoise(e)}}/>
                </div>


            </div>
        );
    }
}

export default ShotFeed;
