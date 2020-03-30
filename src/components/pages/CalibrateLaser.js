import React from 'react';
import Page from '../Page';
import {Row, Col} from "react-bootstrap";
import LaserCalibration from "../LaserCalibration";

class CalibrateLaser extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <Page>
                <Row>
                    <Col sm={12} className={"text-center"}>
                        <h3>Laser Calibration</h3>
                        <p>Before Sharpshooter can detect your shots, it has to be calibrated to see your laser.
                            Below are two feeds, the left is live from your webcam
                            and the right is Take Aim's laser detection. Shine your laser onto the projector
                            screen. If its properly calibrated, Sharpshooter will
                            show it as a little white circle in the screen on the right. If you don't see the
                            circle, adjust the sliders below until you do.</p>
                        <p>Once you finish, click "I'm Done Calibrating" below!</p>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12}>
                        <LaserCalibration complete={() => {this.props.changePage("targetSelection")}}/>
                    </Col>
                </Row>
            </Page>
        );
    }

}

export default CalibrateLaser;