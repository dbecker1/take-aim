import React from 'react';

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
        const video = this.videoRef.current;
        video.height = video.videoHeight;
        video.width = video.videoWidth;

        this.frame = new window.cv.Mat(video.videoHeight, video.videoWidth, window.cv.CV_8UC4);
        this.cap = new window.cv.VideoCapture(this.videoRef.current);

        const minScalar = new window.cv.Scalar(20, 100, 200);
        const maxScalar = new window.cv.Scalar(160, 255, 256);

        this.min = new window.cv.Mat(video.videoHeight, video.videoWidth, window.cv.CV_8UC3, minScalar);
        this.max = new window.cv.Mat(video.videoHeight, video.videoWidth, window.cv.CV_8UC3, maxScalar);
        this.hsv_image = new window.cv.Mat();
        this.threshold = new window.cv.Mat();

        this.processing = false;
        const FPS = 30;

        this.setState({
            showCanvas: true
        }, () => {
            const delay = 1000/FPS
            setInterval(() => {this.processVideo()}, delay);
        })
    }

    processVideo() {
        const video = this.videoRef.current;
        if (this.processing) {
            console.log("Already processing");
            return;
        }
        this.processing = true;
        try {
            this.cap.read(this.frame)

            window.cv.cvtColor(this.frame, this.hsv_image, window.cv.COLOR_BGR2HSV);
            window.cv.inRange(this.hsv_image, this.min, this.max, this.threshold)
            window.cv.imshow(this.canvasRef.current, this.threshold)

        } catch (e) {
            console.log("ERROR")
            console.error(e)
        }

        this.processing = false;
    }

    render() {
        return (
            <div {...this.props}>
                {/*<video ref={this.videoRef} onPlay={() => {setTimeout(() => {this.startProcessing()}, 100)}} />*/}
                <video ref={this.videoRef}  />
                {this.state.showCanvas ? <canvas ref={this.canvasRef} ></canvas> : null}
                <br />
                <button onClick={() => {this.startProcessing()}} >Start</button>
            </div>
        );
    }
}

export default CameraFeed;
