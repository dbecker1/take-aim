import React from 'react';
import {Row, Col, Button} from "react-bootstrap";

class DuelingConfigure extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }

    }

    saveSettings() {
        this.props.saveSettings(this.state)
    }

    render() {
        return (
            <>
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