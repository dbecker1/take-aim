import React from 'react';
import Page from '../Page';
import {Row, Col, Button} from "react-bootstrap";
import {all_targets} from "../../util/targets";
import {Redirect} from "react-router-dom";

class TargetSelection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: "selecting"
        }
    }

    selectTarget(targetName) {
        console.log(targetName)
        this.props.targetScreenManager.drawTarget(targetName)
        this.setState({
            status: "selected"
        })
    }

    render() {
        if (this.state.status === "selecting") {
            return (
                <Page>
                    <Row>
                        <Col sm={12} className={"text-center"}>
                            <h3>Target Selection</h3>
                            <p>Select a target to start shooting at!</p>
                        </Col>
                    </Row>
                    {all_targets.map((value, index) => {
                        return (
                            <Row key={index}>
                                <Col sm={4} className={"text-center"} style={{paddingTop: "70px"}}>
                                    <p><span style={{fontWeight: "bold"}}>Name: </span>{value.displayName}</p>
                                </Col>
                                <Col sm={4} style={{paddingTop: "10px", paddingBottom: "10px"}} className={"text-center"}>
                                    <img src={"/assets/targets/" + value.fileName} style={{height: "200px"}}/>
                                </Col>
                                <Col sm={4} style={{paddingTop: "70px"}} className={"text-center"}>
                                    <Button onClick={() => {this.selectTarget(value.name)}}>Select this target!</Button>
                                </Col>
                            </Row>
                        )
                    })}
                </Page>
            );
        } else if (this.state.status === "selected"){
            return <Redirect to={"/shoot"} />
        }
    }

}

export default TargetSelection;