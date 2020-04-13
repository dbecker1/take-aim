import React from 'react';
import {Row, Col, Button} from "react-bootstrap";
import ShotFeed from "../../shooting/ShotFeed";
import TargetUtils from "../../../../util/TargetUtils"
import {bindActionCreators} from "redux";
import {addTarget, wipeTargets, removeTargetById} from "../../../../app/slices/targetSlice";
import {wipeShots} from "../../../../app/slices/shotSlice";
import {addNonTargetElement, wipeNonTargetElements} from "../../../../app/slices/projectorSlice";
import {connect} from "react-redux";
import NonTargetObject from "../../../../app/pojos/NonTargetObject";
import Target from "../../../../app/pojos/Target";
import Card from "../../../Card";
import {batch} from "react-redux";

class DuelingShoot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            plateOrientations: ["left", "right", "left", "right", "left", "right"],
            targetIds: [null, null, null, null, null, null],
            competitionStarted: false
        }

        this.timerRef = React.createRef();
        this.shotFeedRef = React.createRef();
    }

    componentDidMount() {
        window.createjs.Sound.registerSound("/assets/sounds/timerbeep.wav", "Beep");
        this.resetTarget();
    }

    loadTargets() {
        this.shotFeedRef.current.startProcessing();
        const toLoad = [TargetUtils.loadTarget("tree_plate"), TargetUtils.loadNonTargetImage("tree_stand.svg")];
        Promise.all(toLoad).then(results => {
            let plate = results[0];
            let stand = results[1];
            const {canvasWidth, canvasHeight} = this.props.canvasDimensions;

            if (this.props.settings.useDistance) {
                this.standHeight = TargetUtils.scale(63, this.props.settings.distance, canvasHeight); // dueling tree is 63 inches  tall
            } else {
                this.standHeight = canvasHeight * .8
            }
            this.standWidth = TargetUtils.getTargetWidthForHeight(stand, this.standHeight);
            this.plateHeight = this.standHeight * .119; //Ratio of plate height to stand height
            this.plateWidth = TargetUtils.getTargetWidthForHeight(plate, this.plateHeight);
            this.realPlateHeight = plate.height;

            this.standObj = new NonTargetObject({
                type: "svg",
                x: (canvasWidth - this.standWidth) / 2,
                y: (canvasHeight - this.standHeight) / 2,
                width: this.standWidth,
                height: this.standHeight,
                fileName: "tree_stand.svg"
            });

            this.updateTargets();

            this.props.addNonTargetElement(this.standObj);
        });
    }

    resetTarget() {
        batch(() => {
            this.props.wipeTargets();
            this.props.wipeNonTargetElements();
            this.props.wipeShots();
        });
        this.setState({
            plateOrientations: ["left", "right", "left", "right", "left", "right"],
            targetIds: [null, null, null, null, null, null]
        }, () => {
            this.loadTargets()
        })
    }

    startCompetition() {
        this.shotFeedRef.current.stop();
        this.setState({
            competitionStarted: true
        }, () => {
            setTimeout(() => {
                    window.createjs.Sound.play("Beep");
                    this.shotFeedRef.current.startProcessing();

            }, 5000)
        })
    }

    stopCompetition() {
        this.setState({
            competitionStarted: false
        }, () => {
            this.shotFeedRef.current.stop();
            window.createjs.Sound.play("Beep");
        });
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        for (let i in nextProps.shots) {
            const shot = nextProps.shots[i]
            if (shot.hasOwnProperty("score") && shot.score.hasOwnProperty("targetId")) {
                if (this.state.targetIds.includes(shot.score.targetId)) {
                    return true;
                }
            }
        }
        if (nextState.competitionStarted !== this.state.competitionStarted) {
            return true;
        }
        return false;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.updateTargets();
    }

    updateTargets() {
        let plateOrientations = this.state.plateOrientations;
        let targetIds = this.state.targetIds;
        let targetsToRemove = [];
        for (let i = 0; i < this.props.shots.length; i++) {
            let shot = this.props.shots[i];
            if (shot.hasOwnProperty("score") && shot.score.hasOwnProperty("targetId")) {
                if (this.state.targetIds.includes(shot.score.targetId)) {
                    const index = this.state.targetIds.indexOf(shot.score.targetId);
                    targetsToRemove.push(shot.score.targetId);
                    plateOrientations[index] = plateOrientations[index] === "left" ? "right" : "left"
                }
            }
        }

        for (let i = 0; i < targetsToRemove.length; i++) {
            this.props.removeTargetById(targetsToRemove[i]);
            targetIds[targetIds.indexOf(targetsToRemove[i])] = null
        }

        let toAdd = []
        for (let i = 0; i < this.state.plateOrientations.length; i++) {
            if (targetIds[i] === null) {
                let plateX = this.standObj.x + (this.standObj.width * .4215) - this.plateWidth
                if (this.state.plateOrientations[i] === "right") {
                    plateX = this.standObj.x + (this.standObj.width * .5785)
                }
                const plateObj = new Target({
                    x: plateX,
                    y: this.standObj.y + 10 + (10 + this.plateHeight) * i,
                    width:  this.plateWidth,
                    height:this.plateHeight,
                    name: this.state.plateOrientations[i] === "left" ? "tree_plate" : "tree_plate_flipped",
                    requestedScaleRatio: this.plateHeight / this.realPlateHeight
                })

                targetIds[i] = plateObj.id;
                toAdd.push(plateObj);
                //this.props.addTarget(plateObj);
            }
        }
        batch(() => {
            for (let i in toAdd){
                this.props.addTarget(toAdd[i])
            }
        });
        this.setState({
            targetIds: targetIds,
            plateOrientations: plateOrientations
        }, () => {
            if (this.state.plateOrientations.indexOf("left") < 0 || this.state.plateOrientations.indexOf("right") < 0) {
                this.stopCompetition()
            }
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
                    <Col sm={4}  className={"text-center"}>
                        <Card >
                            <h4 style={{textDecoration: "underline"}}>Competition</h4>
                            <table>
                                <thead>
                                <tr>
                                    <th>Player 1</th>
                                    <th>Player 2</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td>{this.state.plateOrientations.filter(a => a === "left").length}</td>
                                    <td>{this.state.plateOrientations.filter(a => a === "right").length}</td>
                                </tr>
                                </tbody>
                            </table>
                            {!this.state.competitionStarted &&
                                <div style={{marginTop: "20px"}}>
                                    <Button   onClick={() => {this.startCompetition()}}>Start Competition</Button>
                                    <p style={{fontSize: "80%"}}>Competition will start on beep after 5 secnod delay</p>
                                </div>
                            }
                        </Card>
                    </Col>
                    <Col sm={8}>
                        <ShotFeed videoRef={this.props.videoRef} ref={this.shotFeedRef}/>
                    </Col>
                </Row>
                <Row style={{marginTop: "30px"}}>
                    <Col sm={12} className={"text-center"}>
                        <Button variant={"customPrimary"} onClick={() => {this.resetTarget()}} size={"lg"} style={{marginBottom: "10px"}}>Reset Target</Button> <br />
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
    },
    shots: state.shotTracker.shots
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({addTarget, wipeShots, wipeTargets, addNonTargetElement, removeTargetById, wipeNonTargetElements}, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(DuelingShoot);