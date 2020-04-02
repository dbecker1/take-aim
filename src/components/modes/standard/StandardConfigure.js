import React from 'react';
import {Row, Col, Form, Button} from "react-bootstrap";
import Card from "../../Card";
import {all_targets} from "../targets";

class StandardConfigure extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            distance: 5,
            selectedTarget: null
        }

    }

    ready(state) {
        return (!isNaN(state.distance) && state.selectedTarget !== null)
    }

    saveSettings() {
        this.props.saveSettings(this.state)
    }

    render() {
        return (
            <>
                <Row>
                    <Col sm={12} md={{span: 4, offset: 4}}>
                        <Card>
                        <Form.Group>
                            <Form.Label>Distance From Target (in yards)</Form.Label>
                            <Form.Control value={this.state.distance} onChange={(e) => {this.setState({distance: e.target.value})}} type={"number"} />
                        </Form.Group>
                        </Card>
                    </Col>
                </Row>
                <Row style={{marginTop: "20px"}}>
                    <Col sm={12} md={{span: 8, offset: 2}}>
                        <Card>
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
                        <Button variant={"customPrimary"} onClick={() => {this.saveSettings()}} disabled={!this.ready(this.state)} size={"lg"}>Shoot!</Button>
                    </Col>
                </Row>

            </>
        )
    }
}

export default StandardConfigure;