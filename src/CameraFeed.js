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

        this.setState({
            showCanvas: true
        }, () => {
            setTimeout(() => {this.processVideo()}, 0);
        })
    }

    processVideo() {
        const FPS = 10;
        let begin = Date.now()
        try {
            this.cap.read(this.frame)

            let hsv_image = new window.cv.Mat();
            window.cv.cvtColor(this.frame, hsv_image, window.cv.COLOR_BGR2HSV);

            const minScalar = new window.cv.Scalar(20, 100, 200);
            const maxScalar = new window.cv.Scalar(160, 255, 256);

            let min = new window.cv.Mat(hsv_image.rows, hsv_image.cols, hsv_image.type(), minScalar);
            let max = new window.cv.Mat(hsv_image.rows, hsv_image.cols, hsv_image.type(), maxScalar);

            let threshold = new window.cv.Mat();
            window.cv.inRange(hsv_image, min, max, threshold)
            //let hsvPlanes = new window.cv.MatVector();
            window.cv.imshow(this.canvasRef.current, threshold)
            //window.cv.split(hsv_image, hsvPlanes);


            min.delete()
            max.delete()
            threshold.delete()
        } catch (e) {
            console.log("ERROR")
            console.error(e)
        }

        let delay = 1000/FPS - (Date.now() - begin);
        setTimeout(() => {this.processVideo()}, delay);

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
