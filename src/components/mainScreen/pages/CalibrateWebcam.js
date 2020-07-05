import React from 'react';
import {Row, Col, Button} from "react-bootstrap";
import WebcamCalibrator from "../../../util/WebcamCalibrator";
import cookie from "react-cookies";
import Card from "../../Card";
import {connect} from "react-redux";
import {addNonTargetElement, wipeNonTargetElements} from "../../../app/slices/projectorSlice";
import {bindActionCreators} from "redux";
import PostWelcomePage from "./PostLaunchPage";
import {withRouter} from "react-router"
import NonTargetObject from "../../../app/pojos/NonTargetObject";

class CalibrateWebcam extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            corner: 1
        }

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
        this.startCalibrating()
    }

    startCalibrating() {
        console.log("Calibrating!!")
        this.calibrator = new WebcamCalibrator(this.props.videoRef.current, this.canvasRef.current,  this.corners)
        this.showCalibrationMessage()

        this.setState({
            loading: false
        }, () => {
            this.calibrator.start();
        });
    }

    showCalibrationMessage() {
        if (this.state.corner > 4) {
            return;
        }
        let nonTargetElement = new NonTargetObject({
            type: "text",
            text: "Click this corner!",
            fill: "black",
            width: 200,
            height: 30,
            fontSize:  30
        });

        switch(this.state.corner) {
            case 1:
                nonTargetElement.top = 20
                nonTargetElement.left = 5;
                break;
            case 2:
                nonTargetElement.top = 20
                nonTargetElement.left =  this.props.canvasDimensions.canvasWidth - 130 - 5
                break;
            case 3:
                nonTargetElement.left =  this.props.canvasDimensions.canvasWidth - 130 - 5
                nonTargetElement.top = this.props.canvasDimensions.canvasHeight - 5;
                break;
            case 4:
                nonTargetElement.left = 5;
                nonTargetElement.top = this.props.canvasDimensions.canvasHeight -  5;
                break;
        }
        this.props.wipeNonTargetElements();
        this.props.addNonTargetElement(nonTargetElement)
    }

    componentWillUnmount() {
        this.calibrator.release();
    }

    finishCalibrating() {
        cookie.save("webcamConfig", {corners: this.calibrator.getCorners()})
        this.props.wipeNonTargetElements();
        this.props.history.push('/launch')
    }

    reset() {
        this.setState({
            corner: 1
        }, () => {
            this.calibrator.reset();
            this.showCalibrationMessage()
        })
    }

    render() {
        return (
            <PostWelcomePage>
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
                        <canvas ref={this.canvasRef} ></canvas>
                    </Col>
                </Row>
                <Row>
                    {!this.state.loading &&
                    <Col sm={12} className={"text-center"}>
                        {this.state.corner <= 4 ?
                            <Button variant="customPrimary" onClick={() => {
                                this.calibrator.nextCorner();
                                this.setState({corner: this.state.corner + 1}, () => {this.showCalibrationMessage()})
                            }}>
                                Set this corner
                            </Button>
                            :
                            <div>
                                <Button variant="customPrimary" variant="customPrimary" onClick={() => {
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
            </PostWelcomePage>
        );
    }

}

const mapStateToProps = state => ({
    canvasDimensions: {
        canvasHeight: state.projector.canvasHeight,
        canvasWidth: state.projector.canvasWidth
    }
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({addNonTargetElement, wipeNonTargetElements}, dispatch)
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(CalibrateWebcam));