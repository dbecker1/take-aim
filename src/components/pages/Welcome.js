import React from 'react';
import {Row, Col, Button} from "react-bootstrap";
import Card from "../Card";
import cookie from "react-cookies";

class Welcome extends React.Component {
    constructor(props) {
        super(props);
        const webcamConfig = cookie.load("webcamConfig")
        const laserConfig = cookie.load("laserConfig")
        this.state = {
            status: "welcome",
            projectorStatus: "none",
            laserStatus: !!laserConfig ? "ready" : "none",
            webcamStatus: !!webcamConfig ? "ready" : "none"
        }

        if (!!props.resized) {
            this.state.status = "resized"
        }
    }

    launchProjector() {
        this.setState({
            projectorStatus: "resizing"
        }, () => {
            if (!!this.props.launchProjector) {
                this.props.launchProjector();
            }
        })
    }

    static getDerivedStateFromProps(props, state) {
        if (!!props.projectorReady) {
            state["projectorStatus"] = "ready"
            return state
        }
        return null;
    }

    render() {
        const ready = this.state.projectorStatus === "ready" && this.state.laserStatus === "ready" && this.state.webcamStatus === "ready";
        return (
            <>
                <Row>
                    <Col sm={12} className={"text-center"}>
                        <p>Welcome to Take Aim!</p>
                            <>
                                <p>
                                    Take Aim is an open source laser dry fire simulation system. In order to use Take Aim, you will need:
                                    <br />
                                    - Projector
                                    <br />
                                    - Webcam pointed towards projector screen
                                    <br />
                                    - Laser Cartridge or laser shooting dummy gun
                                    <br />
                                    - Google Chrome
                                </p>

                            </>
                    </Col>
                </Row>
                <Row style={{marginTop: "10px"}}>
                    <Col sm={4}>
                        <Card >
                            <div className={"text-center"}>
                                <h5 style={{textDecoration: "underline"}}>Projector Status</h5>
                                {this.state.projectorStatus === "none" ?
                                    <p>Pending Launch</p>
                                    : this.state.projectorStatus === "resizing" ?
                                        <p>Pending Resize</p>
                                        :
                                        <p>Ready</p>}
                                <Button variant="customPrimary" onClick={() => {this.launchProjector()}} disabled={this.state.projectorStatus !== "none"}>Launch Projector Screen</Button>
                            </div>
                        </Card>
                    </Col>
                    <Col sm={4}>
                        <Card >
                            <div className={"text-center"}>
                                <h5 style={{textDecoration: "underline"}}>Webcam Calibration Status</h5>
                                {this.state.webcamStatus === "none" ?
                                    <p>Pending Calibration</p>
                                    :
                                    <p>Ready</p>
                                }
                                <Button variant="customPrimary" onClick={() => {this.props.changePage("calibrateWebcam")}} disabled={this.state.projectorStatus !== "ready"}>Calibrate Webcam</Button>
                                {this.state.projectorStatus !== "ready" && <><br /><span style={{fontSize: "80%"}}>Launch Projector Before Calibration</span></>}
                            </div>
                        </Card>
                    </Col>
                    <Col sm={4}>
                        <Card >
                            <div className={"text-center"}>
                                <h5 style={{textDecoration: "underline"}}>Laser Calibration Status</h5>
                                {this.state.laserStatus === "none" ?
                                    <p>Pending Calibration</p>
                                :
                                    <p>Ready</p>
                                }
                                <Button variant="customPrimary" onClick={() => {this.props.changePage("calibrateLaser")}} >Calibrate Laser</Button>
                            </div>
                        </Card>
                    </Col>
                </Row>
                <Row style={{marginTop: "20px"}}>
                    <Col sm={12} className={"text-center"}>
                        <Button variant="customPrimary" onClick={() => {this.props.changePage("targetSelection")}} disabled={!ready} size="lg">Lets get shooting!</Button>
                    </Col>
                </Row>
            </>
        );
    }

}

export default Welcome;