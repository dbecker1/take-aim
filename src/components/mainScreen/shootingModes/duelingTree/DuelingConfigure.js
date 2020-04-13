import React from 'react';
import {Row, Col, Button, Form, OverlayTrigger, Tooltip} from "react-bootstrap";
import Card from "../../../Card";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import cookie from "react-cookies";

class DuelingConfigure extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            useDistance: false,
            distance: 5,
            distanceToProjector: 0,
            heightOfTargetArea: 0,
        }

        const config = cookie.load("scaleConfig")
        if (!!config) {
            this.state = {...this.state, ...config}
        }
    }

    saveSettings() {
        if (this.state.useDistance) {
            let config = {
                distanceToProjector: this.state.distanceToProjector,
                heightOfTargetArea: this.state.heightOfTargetArea
            }
            cookie.save("scaleConfig", config)
        }
        this.props.saveSettings(this.state)
    }

    render() {
        return (
            <>
                <Row>
                    <Col sm={12} md={{span: 8, offset: 2}}>
                        <Card>
                            <h5 style={{textDecoration: "underline"}}>Configure</h5>
                            <Form inline>
                                <Form.Check
                                    type="switch"
                                    label="Scale Target Using Distance"
                                    id="custom-switch"
                                    checked={this.state.useDistance}
                                    onChange={(e) => {this.setState({useDistance: e.target.checked})}}
                                    inline
                                    style={{marginRight: "2px"}}
                                />

                                <OverlayTrigger
                                    placement={"bottom"}
                                    overlay={
                                        <Tooltip id={`info-tooltip`}>
                                            Checking this will enable Take Aim to display your target as if it were at a
                                            specific distance. Using the height of your projected target area and your
                                            distance to the projector, Take Aim can calculate the size to display the
                                            target at.
                                        </Tooltip>
                                    }
                                >
                                    <FontAwesomeIcon icon={faInfoCircle} style={{marginRight: "1rem"}}/>
                                </OverlayTrigger>
                            </Form>
                            {this.state.useDistance &&
                            <>
                                <hr  style={{borderTop: "1px solid white"}}/>
                                <Form.Group style={{marginTop: "0px", marginBottom: 0}}>
                                    <Form.Label>Desired Distance From Target (in yards)</Form.Label>
                                    <Form.Control value={this.state.distance} onChange={(e) => {this.setState({distance: e.target.value})}} type={"number"} />
                                </Form.Group>
                                <hr  style={{borderTop: "1px solid white"}}/>
                                <p style={{marginBottom: 0}}>The following are measurements needed to accurately depict target size:</p>
                                <Form.Group>
                                    <Form.Label>Distance From You to Screen (in inches)</Form.Label>
                                    <Form.Control  value={this.state.distanceToProjector} onChange={(e) => {this.setState({distanceToProjector: e.target.value})}} type={"number"}/>
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Height of Target Area (in inches)</Form.Label>
                                    <Form.Control  value={this.state.heightOfTargetArea}
                                                   onChange={(e) => {this.setState({heightOfTargetArea: e.target.value})}}
                                                   type={"number"}/>
                                </Form.Group>
                            </>
                            }
                        </Card>
                    </Col>
                </Row>
                <Row style={{marginTop: "20px"}}>
                    <Col sm={12} className={"text-center"}>
                        <Button variant={"customPrimary"} onClick={() => {this.saveSettings()}}  size={"lg"}>Shoot!</Button>
                    </Col>
                </Row>

            </>
        )
    }
}

export default DuelingConfigure;