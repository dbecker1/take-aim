import React from 'react';
import {Row, Col, Button} from "react-bootstrap";
import ShotFeed from "../../shooting/ShotFeed";
import ShotRecord from "../../shooting/ShotRecord";
import TargetUtils from "../../../../util/TargetUtils"
import {bindActionCreators} from "redux";
import {addTarget, wipeTargets, tickTargets} from "../../../../app/slices/targetSlice";
import {wipeNonTargetElements} from "../../../../app/slices/projectorSlice"
import {wipeShots} from "../../../../app/slices/shotSlice";
import {connect} from "react-redux";

class StandardShoot extends React.Component {
    constructor(props) {
        super(props);

        this.timerRef = React.createRef();
    }

    componentDidMount() {
        this.resetTargets()
    }

    resetTargets() {
        this.props.wipeTargets();
        this.props.wipeNonTargetElements();
        this.props.wipeShots();
        const {canvasWidth, canvasHeight} = this.props.canvasDimensions;
        const targetName = "bullseye"
        const target = TargetUtils.getTargetByName(targetName);
        let targetHeight = canvasHeight * .2;
        const targetWidth = TargetUtils.getTargetWidthForHeight(target.name, targetHeight)

        for (let i = 0; i < 5; i++) {

            let displayTarget = {
                name: "bullseye",
                x: Math.random() * canvasWidth * .8,
                y: Math.random() * canvasHeight * .8,
                width: targetWidth,
                height: targetHeight,
                requestedScaleRatio: targetHeight / target.defaultHeight,
                id: TargetUtils.generateId(),
                dx: Math.random() > .5 ? -8: 8,
                dy: Math.random() > .5 ? -8 : 8,
                maxX: canvasWidth - targetWidth,
                maxY: canvasHeight - targetHeight
            }
            this.props.addTarget(displayTarget)
        }

        if (this.hasOwnProperty("interval"))
            clearInterval(this.interval)

        const fps = 20;
        let delay = 1000 / fps;
        this.interval = setInterval(() => {
            this.props.tickTargets()
        }, delay)
    }

    componentWillUnmount() {
        if (this.hasOwnProperty("interval"))
            clearInterval(this.interval)
    }

    getFeed() {
        return <ShotFeed videoRef={this.props.videoRef} />
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
                        <ShotRecord />
                    </Col>
                    <Col sm={8}>
                        {this.getFeed()}
                    </Col>
                </Row>
                <Row style={{marginTop: "30px"}}>
                    <Col sm={12} className={"text-center"}>
                        <Button variant={"customPrimary"} onClick={() => {this.resetTargets()}} size={"lg"} style={{marginBottom: "10px"}}>Reset Target</Button> <br />
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
    return bindActionCreators({addTarget, wipeShots, wipeTargets, wipeNonTargetElements, tickTargets}, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(StandardShoot);