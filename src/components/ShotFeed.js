import React from 'react';
import ShotDetector from "../util/ShotDetector"
import {Button} from "react-bootstrap";
import cookie from 'react-cookies'

class ShotFeed extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            running: false
        }

        this.videoRef = React.createRef();
        this.canvasRef = React.createRef();
    }

    componentDidMount() {
        const video = this.videoRef.current;
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then((stream)  => {
            video.srcObject = stream;
            video.play();
        })
        .catch((err) => {
            console.log("An error occurred! " + err);
        });
    }

    startProcessing() {
        this.setState({
            running: true
        }, () => {
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
                this.shotDetector = new ShotDetector(this.videoRef.current, laserConfig.h, laserConfig.s, laserConfig.v,
                    laserConfig.hRadius, laserConfig.sRadius, laserConfig.vRadius, webcamConfig.corners,
                    this.canvasRef.current, true, 200);
            }


            const canvas = this.canvasRef.current;
            const video = this.videoRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            this.shotDetector.start((hit => {
                console.log(hit)
                ctx.beginPath();
                ctx.arc(hit.x, hit.y, 5, 0, 2*Math.PI, false)
                ctx.lineWidth = 5;
                ctx.strokeStyle = 'red';
                ctx.stroke();
            }))
        })
    }
    //
    // toggle() {
    //     if (this.state.running) {
    //         this.shotDetector.stop();
    //     } else {
    //         this.startProcessing()
    //     }
    //     this.setState({
    //         running: !this.state.running
    //     })
    // }

    render() {
        return (
            <div {...this.props}>
                <div style={{display: this.state.running ? "none" : "inline"}} >
                    <video ref={this.videoRef} />
                    <br />
                    <Button onClick={() => {this.startProcessing()}}>Start shooting!</Button>
                </div>
                <div style={{display: this.state.running ? "inline" : "none"}}>
                    <canvas ref={this.canvasRef}  ></canvas>
                </div>


            </div>
        );
    }
}

export default ShotFeed;
