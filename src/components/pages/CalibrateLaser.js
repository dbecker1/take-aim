import React from 'react';
import Page from '../Page';
import {Row, Col, Button, Form} from "react-bootstrap";
import cookie from "react-cookies";
import LaserCalibrator from "../../util/LaserCalibrator";

class CalibrateLaser extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            h: 90,
            s: 177.5,
            v: 228,
            hRadius: 70,
            sRadius: 77.5,
            vRadius: 28,
            // startButton: true
        };

        this.canvasRef = React.createRef();

        const config = cookie.load("laserConfig")
        if (!!config) {
            this.state = {...this.state, ...config}
        }
    }

    startCalibrating() {
        this.setState({
            startButton: false
        }, () => {
            const canvas = this.canvasRef.current;
            const video = this.props.videoRef.current;

            this.calibrator = new LaserCalibrator(video, canvas)
            this.calibrator.init();

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            this.updateCalibrator();
        })
    }

    componentDidMount() {
        this.startCalibrating()
    }

    doneCalibrating() {
        const config = {
            h: this.state.h,
            s: this.state.s,
            v: this.state.v,
            hRadius: this.state.hRadius,
            sRadius: this.state.sRadius,
            vRadius: this.state.vRadius
        }
        cookie.save("laserConfig", config)
        this.props.changePage("calibrateProjector")
    }

    updateCalibrator() {
        if (!!this.calibrator) {
            this.calibrator.tryLaserCalibration(this.state.h, this.state.s, this.state.v, this.state.hRadius, this.state.sRadius, this.state.vRadius)
        }
    }

    updateValue(object) {
        this.setState(object, () => {
            this.updateCalibrator()
        })
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
                    <Col sm={12} style={{textAlign: "center"}}>
                        <canvas ref={this.canvasRef} ></canvas>
                    </Col>
                </Row>
                <br />
                <Row>
                    <Col sm={6}>
                        <Form.Group>
                            <Form.Label>Hue (H) - {this.state.h}</Form.Label>
                            <Form.Control type="range" min={0} max={179} value={this.state.h} onChange={(value) => {this.updateValue({h: parseInt(value.target.value)})}}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Saturation (S) - {this.state.s}</Form.Label>
                            <Form.Control type="range" min={0} max={255} value={this.state.s} onChange={(value) => {this.updateValue({s: parseInt(value.target.value)})}}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Value (V) - {this.state.v}</Form.Label>
                            <Form.Control type="range" min={0} max={255} value={this.state.v} onChange={(value) => {this.updateValue({v: parseInt(value.target.value)})}}/>
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group>
                            <Form.Label>Hue Radius - {this.state.hRadius}</Form.Label>
                            <Form.Control type="range" min={0} max={89} value={this.state.hRadius} onChange={(value) => {this.updateValue({hRadius: parseInt(value.target.value)})}}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Saturation Radius - {this.state.sRadius}</Form.Label>
                            <Form.Control type="range" min={0} max={127} value={this.state.sRadius} onChange={(value) => {this.updateValue({sRadius: parseInt(value.target.value)})}}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Value Radius - {this.state.vRadius}</Form.Label>
                            <Form.Control type="range" min={0} max={127} value={this.state.vRadius} onChange={(value) => {this.updateValue({vRadius: parseInt(value.target.value)})}}/>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12} className={"text-center"}>
                        <Button onClick={() => {this.doneCalibrating()}}>I'm done calibrating!</Button>
                    </Col>
                </Row>
            </Page>
        );
    }

}

export default CalibrateLaser;