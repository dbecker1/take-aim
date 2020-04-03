import React from 'react';
import {Row, Col, Form, Button, OverlayTrigger, Tooltip} from "react-bootstrap";
import Card from "../../Card";
import {all_targets} from "../targets";
import cookie from "react-cookies";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

class StandardConfigure extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            distance: 5,
            distanceToProjector: 0,
            heightOfTargetArea: 0,
            selectedTarget: null,
            useDistance: false,
            useTimer: false,
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
                                <Form.Check
                                    type="switch"
                                    label="Use Shot Timer"
                                    id="custom-switch2"
                                    checked={this.state.useTimer}
                                    onChange={(e) => {this.setState({useTimer: e.target.checked})}}
                                    inline
                                />
                            </Form>
                            {this.state.useDistance &&
                                <>
                                <Form.Group style={{marginTop: "10px", marginBottom: 0}}>
                                    <Form.Label>Desired Distance From Target (in yards)</Form.Label>
                                    <Form.Control value={this.state.distance} onChange={(e) => {this.setState({distance: e.target.value})}} type={"number"} />
                                </Form.Group>
                                <hr  style={{borderTop: "1px solid white"}}/>
                                <p style={{marginBottom: 0}}>The following are measurements needed to accurately depict target size:</p>
                                    <Form.Group>
                                        <Form.Label>Distance From You to Screen (in inches)</Form.Label>
                                        <Form.Control  value={this.state.distanceToProjector} onChange={(e) => {this.setState({distanceToProjector: e.target.value})}} tyle={"number"}/>
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
                    <Col sm={12} md={{span: 8, offset: 2}}>
                        <Card>
                            <h5 style={{textDecoration: "underline"}}>Target Selection</h5>
                            <table>
                                <tbody>
                                    {all_targets.map((value, key) => {
                                        return (
                                            <tr key={key} >
                                                <td>
                                                    <span style={{fontWeight: "bold"}}>Name: </span>{value.displayName}
                                                </td>
                                                <td className={"text-center"}>
                                                    <img src={"/assets/targets/" + value.fileName} style={{height: "200px", marginTop: "30px"}}/>
                                                </td>
                                                <td className={"text-center"}>
                                                    {this.state.selectedTarget === value.name ?
                                                        <p>Selected</p>
                                                        :
                                                        <Button variant="customPrimary" onClick={() => {this.setState({selectedTarget: value.name})}}>Select this target!</Button>
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </Card>
                    </Col>
                </Row>
                <Row style={{marginTop: "20px"}}>
                    <Col sm={12} className={"text-center"}>
                        <Button variant={"customPrimary"} onClick={() => {this.saveSettings()}} disabled={this.state.selectedTarget === null} size={"lg"}>Shoot!</Button>
                    </Col>
                </Row>

            </>
        )
    }
}

export default StandardConfigure;