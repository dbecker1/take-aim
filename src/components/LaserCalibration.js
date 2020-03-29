import React from 'react';
import Calibrator from "../util/Calibrator"
import {Button, Form, Col, Row} from "react-bootstrap";
import cookie from 'react-cookies'

class LaserCalibration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            h: 90,
            s: 177.5,
            v: 228,
            hRadius: 70,
            sRadius: 77.5,
            vRadius: 28,
            startButton: true
        };

        this.videoRef = React.createRef();
        this.canvasRef = React.createRef();

        const config = cookie.load("laserConfig")
        if (!!config) {
            this.state = {...this.state, ...config}
        }
    }

    componentDidMount() {
        const video = this.videoRef.current;
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then((stream)  => {
                video.srcObject = stream;
                video.onPlay = () => {
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
        this.setState({
            startButton: false
        }, () => {
            const canvas = this.canvasRef.current;
            const video = this.videoRef.current;

            this.calibrator = new Calibrator(video, canvas)
            this.calibrator.init();

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            this.updateCalibrator();
        })
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
        if (!!this.props.complete) {
            this.props.complete()
        }
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
            <div {...this.props}>
                <Row>
                    <Col sm={6}>
                        <video ref={this.videoRef} style={{marginRight: "5px", marginLeft: "-100px"}}/>
                    </Col>
                    <Col sm={6} style={{textAlign: "center"}}>
                        {this.state.startButton?
                            <Button onClick={() => {this.startCalibrating()}} >Click this button one your video is playing on the left!</Button>
                        :
                            <canvas ref={this.canvasRef} ></canvas>
                        }
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
            </div>
        );
    }
}

export default LaserCalibration;
