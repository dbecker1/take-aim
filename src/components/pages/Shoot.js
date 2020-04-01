import React from 'react';
import {Row, Col} from "react-bootstrap";
import ShotFeed from "../ShotFeed";
import Card from "../Card";

class Shoot extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <Row>
                    <Col sm={12} className={"text-center"}>
                        <h3>Shoot!</h3>
                        <p>Double check that your webcam is good to go, and then click start shooting!</p>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12} className={"text-center"}>
                        <ShotFeed targetScreenManager={this.props.targetScreenManager} videoRef={this.props.videoRef}/>
                    </Col>
                </Row>
            </>
        );
    }

}

export default Shoot;