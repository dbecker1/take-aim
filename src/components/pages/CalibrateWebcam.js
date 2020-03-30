import React from 'react';
import Page from '../Page';
import {Row, Col} from "react-bootstrap";

class CalibrateWebcam extends React.Component {
    constructor(props) {
        super(props);

        this.videoRef = React.createRef();
        this.canvasRef = React.createRef();
    }

    componentDidMount() {
        this.props.targetScreenManager.showCalibrationScreen();
        const video = this.videoRef.current;
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then((stream)  => {
                video.srcObject = stream;
                video.onplay = () => {
                    setTimeout(() => {
                        this.startCalibrating()
                    }, 1000)
                }
                video.play();

            })
            .catch((err) => {
                console.log("An error occurred! " + err);
            });
    }

    startCalibrating() {
        console.log("Calibrating!!")
    }

    render() {
        return (
            <Page>
                <Row>
                    <Col sm={12} className={"text-center"}>
                        <h3>Webcam Calibration</h3>
                        <p>Now that we've calibrated your laser, we need to calibrate your webcam. Take Aim will
                        project a picture of a checkerboard and then attempt to identify the corners of it. Once
                        it finds the corners, it will mark them on the feed below. If the corners are properly
                        identified, click "Looks Good To Me!" below. </p>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12} className={"text-center"}>
                        <video ref={this.videoRef} style={{display: "none"}}/>
                        <canvas ref={this.canvasRef} ></canvas>
                    </Col>
                </Row>
            </Page>
        );
    }

}

export default CalibrateWebcam;