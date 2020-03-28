import React from 'react';
import ShotDetector from "./ShotDetector"

class CameraFeed extends React.Component {
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
        if (!this.shotDetector) {
            this.shotDetector = new ShotDetector(this.videoRef.current, this.canvasRef.current, 200);
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
    }

    toggle() {
        if (this.state.running) {
            this.shotDetector.stop();
        } else {
            this.startProcessing()
        }
        this.setState({
            running: !this.state.running
        })
    }

    render() {
        return (
            <div {...this.props}>
                <video ref={this.videoRef}  />
                <canvas ref={this.canvasRef} ></canvas>
                <br />
                <button onClick={() => {this.toggle()}} >{this.state.running ? "Stop" : "Start"}</button>
            </div>
        );
    }
}

export default CameraFeed;
