import React from 'react';
import {Row, Col, Button} from "react-bootstrap";
import ShotFeed from "../../shooting/ShotFeed";
import ShotTimer from "../../shooting/ShotTimer";
import ShotRecord from "../../shooting/ShotRecord";
import TargetUtils from "../../../../util/TargetUtils"
import {bindActionCreators} from "redux";
import {addTarget, wipeTargets} from "../../../../app/slices/targetSlice";
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
        TargetUtils.loadTarget(this.props.settings.selectedTarget).then(image => {
            const {canvasWidth, canvasHeight} = this.props.canvasDimensions;
            const targetName = this.props.settings.selectedTarget;
            const target = TargetUtils.getTargetByName(targetName);
            let targetHeight = 0;
            if (this.props.settings.useDistance) {
                targetHeight = TargetUtils.scaleTarget(target, this.props.settings.distance, canvasHeight);
            } else {
                targetHeight = canvasHeight * .7
            }
            const targetWidth = TargetUtils.getTargetWidthForHeight(image, targetHeight)
            let targetObject = {
                name: targetName,
                x: (canvasWidth - targetWidth) / 2,
                y: (canvasHeight - targetHeight) / 2,
                width: targetWidth,
                height: targetHeight,
                requestedScaleHeight: targetHeight / image.height,
                id: randomstring.generate(7)
            }
            this.props.addTarget(targetObject);

        });
    }

    getFeed() {
        return <ShotFeed videoRef={this.props.videoRef}/>
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
    return bindActionCreators({addTarget, wipeShots, wipeTargets}, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(StandardShoot);