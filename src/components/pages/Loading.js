import React from 'react';
import Page from '../Page';
import {Row, Col} from "react-bootstrap";

class Welcome extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Page>
                <Row>
                    <Col sm={12} className={"text-center"}>
                        <h1>Sharpshooter</h1>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12} className={"text-center"}>
                        <p>Loading...</p>
                    </Col>
                </Row>
            </Page>
        );
    }

}

export default Welcome;