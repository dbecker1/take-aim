import React from 'react';
import {Row, Col, Button} from "react-bootstrap";
import ShotFeed from "../../ShotFeed";

class StandardShoot extends React.Component {
    constructor(props) {
        super(props);

        this.shotRef = React.createRef();
    }

    componentDidMount() {
        this.props.targetScreenManager.wipeScreen()
        this.props.targetScreenManager.drawTarget(this.props.settings.selectedTarget, () => {
            this.shotRef.current.startProcessing();
        })
    }

    render() {
        return (
            <>
                <Row>
                    <Col sm={12} className={"text-center"}>
                        <p>Start shooting!</p>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12}>
                        <ShotFeed ref={this.shotRef} targetScreenManager={this.props.targetScreenManager} videoRef={this.props.videoRef}/>
                    </Col>
                </Row>
                <Row style={{marginTop: "30px"}}>
                    <Col sm={12} className={"text-center"}>
                        <Button variant={"customPrimary"} onClick={() => {this.props.backToSettings()}} size={"lg"}>Back To Settings</Button>
                    </Col>
                </Row>
            </>
        )
    }
}

export default StandardShoot;