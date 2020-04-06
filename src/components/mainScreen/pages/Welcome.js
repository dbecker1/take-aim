import React from 'react';
import {Row, Col, Button} from "react-bootstrap";
import Card from "../../Card";
import {withRouter} from "react-router";

class Loading extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <>
                <Row>
                    <Col sm={12} md={{span: 6, offset: 3}} className={"text-center"}>
                        <h3>Welcome to Take Aim!</h3>
                        <>
                            <p>
                                Take Aim is the only open sourced, web-based, laser dry fire shooting system. Use any
                                laser cartridge or laser gun along with your laptop, webcam, and projector to get
                                started!
                            </p>
                        </>
                    </Col>
                </Row>
                <Row className={"text-center"}>
                    <Col sm={12}>
                        <h4  style={{textDecoration: "underline"}}>Features</h4>
                    </Col>
                </Row>
                <Row className={"text-center"}>
                    <Col sm={4}>
                        <Card style={{height: "100%"}}>
                            <h5>Live Shot Judgment</h5>
                            <p>Take Aim will give you immediate feedback for each shot that you fire!</p>
                        </Card>
                    </Col>
                    <Col sm={4}>
                        <Card style={{height: "100%"}}>
                            <h5>Shot Timer</h5>
                            <p>Take Aim's shot timer will tell you how fast your shots are. Use this to measure your time
                            from draw to first shot!</p>
                        </Card>
                    </Col>
                    <Col sm={4}>
                        <Card style={{height: "100%"}}>
                            <h5>Projected Targets</h5>
                            <p>No need to tape targets to the wall! Take Aim will project targets onto the wall for you!</p>
                        </Card>
                    </Col>
                </Row>
                <Row className={"text-center"} style={{marginTop: "20px"}}>
                    <Col sm={12}>
                        <h4  style={{textDecoration: "underline"}}>Requirements</h4>
                        <p>In order to get started, you will need:</p>
                    </Col>
                </Row>
                <Row className={"text-center"}>
                    <Col sm={3}>
                        <Card style={{height: "100%"}}>
                            <h5>Webcam</h5>
                            <p>External webcams work best. If you don't there are apps that let you use your smartphone
                                as an external webcam!</p>
                        </Card>
                    </Col>
                    <Col sm={3}>
                        <Card style={{height: "100%"}}>
                            <h5>Laser Cartridge</h5>
                            <p>Any laser cartridge or laser shooting gun should work!</p>
                        </Card>
                    </Col>
                    <Col sm={3}>
                        <Card style={{height: "100%"}}>
                            <h5>Projector</h5>
                            <p>Any projector should be fine, although short-throw projectors are ideal!</p>
                        </Card>
                    </Col>
                    <Col sm={3}>
                        <Card style={{height: "100%"}}>
                            <h5>Computer</h5>
                            <p>Mac, Windows or Linux - doesn't matter since Take Aim is web based!</p>
                        </Card>
                    </Col>
                </Row>
                <Row style={{marginTop: "20px"}}>
                    <Col sm={12} className={"text-center"}>
                        <Button variant={"customPrimary"}
                                onClick={() => {this.props.history.push("/launch")}}
                                disabled={!(this.props.videoReady && this.props.cvReady)}>Lets Get Started!</Button>
                        { !this.props.videoReady ?
                            <p style={{fontSize: "80%"}}>Waiting on webcam feed...</p>
                        : !this.props.cvReady ?
                            <p style={{fontSize: "80%"}}>Still loading...</p>
                        :
                            null
                        }
                    </Col>
                </Row>
            </>
        );
    }

}

export default withRouter(Loading);