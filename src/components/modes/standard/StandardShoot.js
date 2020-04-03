import React from 'react';
import {Row, Col, Button} from "react-bootstrap";
import ShotFeed from "../../ShotFeed";
import TargetUtils from "../../../util/TargetUtils"

class StandardShoot extends React.Component {
    constructor(props) {
        super(props);

        this.shotRef = React.createRef();
    }

    componentDidMount() {
        this.props.targetScreenManager.wipeScreen()
        if (this.props.settings.useDistance) {
            TargetUtils.loadTarget(this.props.settings.selectedTarget).then(image => {
                const { canvasWidth, canvasHeight } = this.props.targetScreenManager.getDimensions();
                const targetName = this.props.settings.selectedTarget;
                const target = TargetUtils.getTargetByName(targetName)
                const targetHeight = TargetUtils.scaleTarget(target, this.props.settings.distance, canvasHeight);
                const targetWidth = TargetUtils.getTargetWidthForHeight(image, targetHeight)
                this.props.targetScreenManager.draw(image, (canvasWidth - targetWidth) / 2, (canvasHeight  - targetHeight) / 2, targetWidth, targetHeight);
                this.shotRef.current.startProcessing();
            }).catch(error => {
                console.error(error);
            })
        } else {
            this.props.targetScreenManager.drawTarget(this.props.settings.selectedTarget).then(() => {
                this.shotRef.current.startProcessing();
            }).catch(error => {
                console.error(error)
            })
        }
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