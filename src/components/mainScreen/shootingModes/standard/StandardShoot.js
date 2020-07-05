import React from 'react';
import {Row, Col, Button} from "react-bootstrap";
import ShotFeed from "../../shooting/ShotFeed";
import ShotTimer from "../../shooting/ShotTimer";
import ShotRecord from "../../shooting/ShotRecord";
import TargetUtils from "../../../../util/TargetUtils"
import {bindActionCreators} from "redux";
import {addTarget, wipeTargets} from "../../../../app/slices/targetSlice";
import {addNonTargetElement, wipeNonTargetElements} from "../../../../app/slices/projectorSlice"
import { setTwoPlayerStatus } from "../../../../app/slices/configSlice";
import {wipeShots} from "../../../../app/slices/shotSlice";
import {connect} from "react-redux";
var randomstring = require("randomstring");

class StandardShoot extends React.Component {
    constructor(props) {
        super(props);

        this.timerRef = React.createRef();
    }

    componentDidMount() {
        this.props.wipeTargets();
        this.props.wipeNonTargetElements();
        const {canvasWidth, canvasHeight} = this.props.canvasDimensions;
        const targetName = this.props.settings.selectedTarget;
        const target = TargetUtils.getTargetByName(targetName);
        let targetHeight = 0;
        if (this.props.settings.useDistance) {
            targetHeight = TargetUtils.scaleTarget(target, this.props.settings.distance, canvasHeight);
        } else {
            targetHeight = canvasHeight * .7
        }
        const targetWidth = TargetUtils.getTargetWidthForHeight(target.name, targetHeight)
        if (this.props.settings.twoPlayer) {
            this.props.setTwoPlayerStatus(true)
            let playerOneTarget = {
                name: targetName,
                x: (canvasWidth / 4) - (targetWidth / 2),
                y: (canvasHeight - targetHeight) / 2,
                width: targetWidth,
                height: targetHeight,
                requestedScaleRatio: targetHeight / target.defaultHeight,
                id: TargetUtils.generateId()
            }
            let playerTwoTarget = {
                name: targetName,
                x: (canvasWidth * 3 / 4) - (targetWidth / 2),
                y: (canvasHeight - targetHeight) / 2,
                width: targetWidth,
                height: targetHeight,
                requestedScaleRatio: targetHeight / target.defaultHeight,
                id: TargetUtils.generateId()
            }
            this.props.addTarget(playerOneTarget)
            this.props.addTarget(playerTwoTarget)

            let dividingLine = {
                id: TargetUtils.generateId(),
                type: "rect",
                x: (canvasWidth / 2) - 3,
                y: 10,
                width: 6,
                height: canvasHeight - 20,
                fill: "black"
            };
            this.props.addNonTargetElement(dividingLine)
        } else {
            this.props.setTwoPlayerStatus(false)
            let targetObject = {
                name: targetName,
                x: (canvasWidth - targetWidth) / 2,
                y: (canvasHeight - targetHeight) / 2,
                width: targetWidth,
                height: targetHeight,
                requestedScaleRatio: targetHeight / target.defaultHeight,
                id: TargetUtils.generateId()
            }
            this.props.addTarget(targetObject);
        }


    }

    getFeed() {
        const {canvasWidth, canvasHeight} = this.props.canvasDimensions;
        var scoringZones = []
        if (this.props.settings.twoPlayer) {
            scoringZones = [
                {
                    name: "Player 1",
                    x: 0,
                    y: 0,
                    width: canvasWidth / 2,
                    height: canvasHeight
                },
                {
                    name: "Player 2",
                    x: canvasWidth / 2,
                    y: 0,
                    width: canvasWidth / 2,
                    height: canvasHeight
                }
            ]
        }
        return <ShotFeed videoRef={this.props.videoRef} scoringZones={scoringZones}/>
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
                    <Col sm={4}>
                        {this.props.settings.useTimer &&
                        <div style={{marginBottom: "10px"}}>
                            <ShotTimer timerType={this.props.settings.timerType}/>
                        </div>

                        }
                        <ShotRecord />
                    </Col>
                    <Col sm={8}>
                        {this.getFeed()}
                    </Col>
                </Row>
                <Row style={{marginTop: "30px"}}>
                    <Col sm={12} className={"text-center"}>
                        <Button variant={"customPrimary"} onClick={() => {this.props.wipeShots()}} size={"lg"} style={{marginBottom: "10px"}}>Reset Target</Button> <br />
                        <Button variant={"customPrimary"} onClick={() => {this.props.backToSettings()}} size={"lg"}>Back To Settings</Button>
                    </Col>
                </Row>
            </>
        )
    }
}

const mapStateToProps = state => ({
    canvasDimensions: {
        canvasHeight: state.projector.canvasHeight,
        canvasWidth: state.projector.canvasWidth
    }
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({addTarget, wipeShots, wipeTargets, addNonTargetElement, wipeNonTargetElements, setTwoPlayerStatus}, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(StandardShoot);