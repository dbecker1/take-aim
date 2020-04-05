import React from 'react';
import {Row, Col, Button} from "react-bootstrap";
import ShotFeed from "../../shooting/ShotFeed";
import ShotTimer from "../../shooting/ShotTimer";
import TargetUtils from "../../../util/TargetUtils"

class StandardShoot extends React.Component {
    constructor(props) {
        super(props);

        this.shotRef = React.createRef();
        this.timerRef = React.createRef();
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

    getFeed() {
        return <ShotFeed ref={this.shotRef} targetScreenManager={this.props.targetScreenManager} videoRef={this.props.videoRef}/>
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
                    {this.props.settings.useTimer ?
                        <>
                            <Col sm={4}>
                                <ShotTimer timerType={this.props.settings.timerType}/>
                            </Col>
                            <Col sm={8}>
                                {this.getFeed()}
                            </Col>
                        </>
                    :
                        <Col sm={12}>
                            {this.getFeed()}
                        </Col>
                    }

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