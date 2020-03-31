import React from 'react';
import Page from '../Page';
import {Row, Col, Button} from "react-bootstrap";
import WebcamCalibrator from "../../util/WebcamCalibrator";
import cookie from "react-cookies";

class CalibrateWebcam extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            corner: 1
        }

        this.videoRef = React.createRef();
        this.canvasRef = React.createRef();

        const config = cookie.load("webcamConfig")
        if (!!config) {
            this.corners = config.corners
            this.state.corner = 5
        } else {
            this.corners = null
        }
    }

    componentDidMount() {
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
        this.calibrator = new WebcamCalibrator(this.videoRef.current, this.canvasRef.current, this.props.targetScreenManager, this.corners)

        this.setState({
            loading: false
        }, () => {
            this.calibrator.start();
        });
    }

    componentWillUnmount() {
        this.calibrator.release();
    }

    finishCalibrating() {
        cookie.save("webcamConfig", {corners: this.calibrator.getCorners()})
        this.props.changePage("targetSelection")
    }

    reset() {
        this.setState({
            corner: 1
        }, () => {
            this.calibrator.reset();
        })
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
                <Row>
                    {!this.state.loading &&
                    <Col sm={12} className={"text-center"}>
                        {this.state.corner <= 4 ?
                            <Button onClick={() => {
                                this.calibrator.nextCorner();
                                this.setState({corner: this.state.corner + 1})
                            }}>
                                Set this corner
                            </Button>
                            :
                            <div>
                                <Button onClick={() => {
                                    this.finishCalibrating()
                                }}>
                                    Looks Good To Me!
                                </Button>
                                <br />
                                <Button style={{marginTop: 10}} variant="danger" onClick={() => {
                                    this.reset()
                                }}>
                                    Reset Calibration
                                </Button>
                            </div>
                        }

                    </Col>
                    }
                </Row>
            </Page>
        );
    }

}

export default CalibrateWebcam;