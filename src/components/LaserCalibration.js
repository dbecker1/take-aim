import React from 'react';
import Calibrator from "../util/Calibrator"
import {Button, Form} from "react-bootstrap";

class LaserCalibration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            h: 90,
            s: 177.5,
            v: 228,
            hRadius: 70,
            sRadius: 77.5,
            vRadius: 28
        };

        this.videoRef = React.createRef();
        this.canvasRef = React.createRef();
    }

    componentDidMount() {
        const video = this.videoRef.current;
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then((stream)  => {
                video.srcObject = stream;
                video.play();
            })
            .catch((err) => {
                console.log("An error occurred! " + err);
            });
    }

    startCalibrating() {
        const canvas = this.canvasRef.current;
        const video = this.videoRef.current;

        this.calibrator = new Calibrator(video, canvas)
        this.calibrator.init();

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        this.updateCalibrator();
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
                <video ref={this.videoRef}  />
                <canvas ref={this.canvasRef} ></canvas>
                <br />
                <Form>
                    <Form.Group>
                        <Form.Label>Hue (H) - {this.state.h}</Form.Label>
                        <Form.Control type="range" min={0} max={179} value={this.state.h} onChange={(value) => {this.updateValue({h: value.target.value})}}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Saturation (S) - {this.state.s}</Form.Label>
                        <Form.Control type="range" min={0} max={255} value={this.state.s} onChange={(value) => {this.updateValue({s: value.target.value})}}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Value (V) - {this.state.v}</Form.Label>
                        <Form.Control type="range" min={0} max={255} value={this.state.v} onChange={(value) => {this.updateValue({v: value.target.value})}}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Hue Radius - {this.state.hRadius}</Form.Label>
                        <Form.Control type="range" min={0} max={89} value={this.state.hRadius} onChange={(value) => {this.updateValue({hRadius: value.target.value})}}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Saturation Radius - {this.state.sRadius}</Form.Label>
                        <Form.Control type="range" min={0} max={127} value={this.state.sRadius} onChange={(value) => {this.updateValue({sRadius: value.target.value})}}/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Value Radius - {this.state.vRadius}</Form.Label>
                        <Form.Control type="range" min={0} max={127} value={this.state.vRadius} onChange={(value) => {this.updateValue({vRadius: value.target.value})}}/>
                    </Form.Group>
                </Form>
                <Button onClick={() => {this.startCalibrating()}}>Start Calibrating!</Button>
            </div>
        );
    }
}

export default LaserCalibration;
