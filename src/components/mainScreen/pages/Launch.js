import React from 'react';
import {Row, Col, Button} from "react-bootstrap";
import Card from "../../Card";
import cookie from "react-cookies";
import {faCheck, faInfoCircle, faTimes} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {connect} from "react-redux";
import ReactGA from "react-ga";
import {withRouter} from "react-router"
import {bindActionCreators} from "redux";
import {launchProjector} from "../../../app/slices/projectorSlice";

class Launch extends React.Component {
    constructor(props) {
        super(props);
        const webcamConfig = cookie.load("webcamConfig")
        const laserConfig = cookie.load("laserConfig")
        this.state = {
            status: "welcome",
            projectorStatus: "none",
            laserStatus: !!laserConfig ? "ready" : "none",
            webcamStatus: !!webcamConfig ? "ready" : "none",
            videoReady: false
        }

        if (!!props.resized) {
            this.state.status = "resized"
        }
    }

    componentDidMount() {
        ReactGA.pageview(window.location.pathname + window.location.search);
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
                        <p>Before we can get shooting, we need to launch the projector screen, calibrate our webcam,
                            and calibrate our laser.
                        </p>
                        <p>Once each of these is ready, click "Let's Get Shooting!"</p>
                    </Col>
                </Row>
                <Row style={{marginTop: "10px"}}>
                    <Col sm={4}>
                        <Card >
                            <div className={"text-center"}>
                                <h5 style={{textDecoration: "underline"}}>Projector Status</h5>
                                {this.state.projectorStatus === "none" ?
                                    <>
                                        <p>Pending Launch</p>
                                        <p><FontAwesomeIcon icon={faTimes} style={{color: "red"}}/></p>
                                    </>
                                    : this.state.projectorStatus === "resizing" ?
                                        <>
                                            <p>Pending Resize</p>
                                            <p><FontAwesomeIcon icon={faTimes} style={{color: "red"}}/></p>
                                        </>
                                        :
                                        <>
                                            <p>Ready</p>
                                            <p><FontAwesomeIcon icon={faCheck} style={{color: "green"}}/></p>
                                        </>}
                                <Button variant="customPrimary" onClick={() => {this.props.launchProjector()}} disabled={this.state.projectorStatus !== "none"}>Launch Projector Screen</Button>
                            </div>
                        </Card>
                    </Col>
                    <Col sm={4}>
                        <Card >
                            <div className={"text-center"}>
                                <h5 style={{textDecoration: "underline"}}>Webcam Calibration Status</h5>
                                {this.state.webcamStatus === "none" ?
                                    <>
                                        <p>Pending Calibration</p>
                                        <p><FontAwesomeIcon icon={faTimes} style={{color: "red"}}/></p>
                                    </>
                                    :
                                    <>
                                        <p>Ready</p>
                                        <p><FontAwesomeIcon icon={faCheck} style={{color: "green"}}/></p>
                                    </>
                                }
                                <Button variant="customPrimary" onClick={() => {this.props.history.push('/calibrateWebcam')}} disabled={this.state.projectorStatus !== "ready"}>Calibrate Webcam</Button>
                                {this.state.projectorStatus !== "ready" && <><br /><span style={{fontSize: "80%"}}>Launch Projector Before Calibration</span></>}
                            </div>
                        </Card>
                    </Col>
                    <Col sm={4}>
                        <Card >
                            <div className={"text-center"}>
                                <h5 style={{textDecoration: "underline"}}>Laser Calibration Status</h5>
                                {this.state.laserStatus === "none" ?
                                    <>
                                        <p>Pending Calibration</p>
                                        <p><FontAwesomeIcon icon={faTimes} style={{color: "red"}}/></p>
                                    </>
                                :
                                    <>
                                        <p>Ready</p>
                                        <p><FontAwesomeIcon icon={faCheck} style={{color: "green"}}/></p>
                                    </>
                                }
                                <Button variant="customPrimary" onClick={() => {this.props.history.push('/calibrateLaser')}} disabled={this.state.projectorStatus !== "ready"}>Calibrate Laser</Button>
                                {this.state.projectorStatus !== "ready" && <><br /><span style={{fontSize: "80%"}}>Launch Projector Before Calibration</span></>}
                            </div>
                        </Card>
                    </Col>
                </Row>
                <Row style={{marginTop: "20px"}}>
                    <Col sm={12} className={"text-center"}>
                        <Button variant="customPrimary" onClick={() => {this.props.history.push('/selectMode')}} disabled={!ready} size="lg">Lets get shooting!</Button>
                    </Col>
                </Row>
            </>
        );
    }

}

const mapStateToProps = state => ({
    projectorReady: state.projector.resized
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({launchProjector}, dispatch)
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Launch));