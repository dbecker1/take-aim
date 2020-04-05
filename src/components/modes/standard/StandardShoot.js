import React from 'react';
import {Row, Col, Button} from "react-bootstrap";
import ShotFeed from "../../shooting/ShotFeed";
import ShotTimer from "../../shooting/ShotTimer";
import TargetUtils from "../../../util/TargetUtils"
import {bindActionCreators} from "redux";
import {addTarget, wipeTargets} from "../../../app/slices/targetSlice";
import {connect} from "react-redux";

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
                targetHeight = canvasHeight * .8
            }
            const targetWidth = TargetUtils.getTargetWidthForHeight(image, targetHeight)
            let targetObject = {
                name: targetName,
                x: (canvasWidth - targetWidth) / 2,
                y: (canvasHeight - targetHeight) / 2,
                width: targetWidth,
                height: targetHeight
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

const mapStateToProps = state => ({
    canvasDimensions: {
        canvasHeight: state.projector.canvasHeight,
        canvasWidth: state.projector.canvasWidth
    }
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({addTarget, wipeTargets}, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(StandardShoot);