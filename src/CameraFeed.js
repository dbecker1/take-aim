import React from 'react';
import ShotDetector from "./ShotDetector"

class CameraFeed extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showCanvas: false
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
            //this.startProcessing()
        })
        .catch((err) => {
            console.log("An error occurred! " + err);
        });
    }

    startProcessing() {
        this.shotDetector = new ShotDetector(this.videoRef.current, 30, this.canvasRef.current);

        this.setState({
            showCanvas: true
        }, () => {
            this.shotDetector.start()
        })
    }

    render() {
        return (
            <div {...this.props}>
                {/*<video ref={this.videoRef} onPlay={() => {setTimeout(() => {this.startProcessing()}, 100)}} />*/}
                <video ref={this.videoRef}  />
                <canvas ref={this.canvasRef} ></canvas>
                <br />
                <button onClick={() => {this.startProcessing()}} >Start</button>
            </div>
        );
    }
}

export default CameraFeed;
