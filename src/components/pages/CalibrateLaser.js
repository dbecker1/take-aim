import React from 'react';
import Page from '../Page';
import {Row, Col} from "react-bootstrap";
import LaserCalibration from "../LaserCalibration";
import {Redirect} from "react-router-dom";

class CalibrateLaser extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            status: "calibrating"
        }
    }

    render() {
        if (this.state.status === "calibrating") {
            return (
                <Page>
                    <Row>
                        <Col sm={12} className={"text-center"}>
                            <h3>Laser Calibration</h3>
                            <p>Before Sharpshooter can detect your shots, it has to be calibrated to see your laser.
                                Below are two feeds, the left is live from your webcam
                                and the right is Sharpshooter's laser detection. Shine your laser onto the projector
                                screen. If its properly calibrated, Sharpshooter will
                                show it as a little white circle in the screen on the right. If you don't see the
                                circle, adjust the sliders below until you do.</p>
                            <p>Once you finish, click "I'm Done Calibrating" below!</p>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={12}>
                            <LaserCalibration complete={() => {this.setState({status: "calibrated"})}}/>
                        </Col>
                    </Row>
                </Page>
            );
        } else if (this.state.status === "calibrated") {
            return (
                <Redirect to={"targetSelection"} />
            )
        }
    }

}

export default CalibrateLaser;