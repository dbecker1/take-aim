import React from 'react';
import {Button, Form} from "react-bootstrap";
import Card from "../Card";
import { connect } from "react-redux";
import { setTimer } from "../../app/slices/shotSlice";
import { bindActionCreators } from "redux";

class ShotTimer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            delay: 0.5,
            status: "reset",
            showShotsAfter: null
        }
    }

    componentDidMount() {
        window.createjs.Sound.registerSound("/assets/sounds/timerbeep.wav", "Beep");
    }

    startTimer() {

        this.setState({
            status: "started",
            showShotsAfter: new Date()
        }, () => {
            if (this.props.timerType === "running") {
                this.delay = setTimeout(() => {
                    this.props.setTimer(new Date())
                    window.createjs.Sound.play("Beep");
                }, this.state.delay * 1000)
            } else {
                this.interval = setInterval(() => {
                    this.props.setTimer(new Date())
                    window.createjs.Sound.play("Beep");
                }, this.state.delay * 1000)
            }
        })
    }

    stopTimer() {
        if (this.props.timerType === "cycle") {
            clearInterval(this.interval)
        } else {
            clearTimeout(this.delay)
        }
        this.setState({
            status: "stopped"
        });
        this.props.setTimer(null);
    }

    resetTimer() {
        this.setState({
            status: "reset",
        })
    }

    onHit() {
        if (this.state.status === "started") {
            let now = new Date();
            let split = now - this.state.start;
            let shots = this.state.shots;
            shots.push(split);
            this.setState({
                shots: shots,
                start: now
            });
        }
    }

    filterShots(shots, showShotsAfter) {
        return shots.filter(a => {return a.timestamp > showShotsAfter})
    }

    render() {
        return (
            <Card className={"text-center"}>
                <h4 style={{textDecoration: "underline"}}>Shot Timer</h4>
                <Form.Group>
                    <Form.Label>Delay Time (in seconds) </Form.Label>
                    <Form.Control type={"number"}
                                  value={this.state.delay}
                                  onChange={(e) => this.setState({delay: e.target.value})}
                                  step={.1}
                                  disabled={this.state.status !== "reset"}/>
                </Form.Group>
                {this.state.status === "reset" ?
                    <div className={"text-center"}>
                        <Button variant="customPrimary" onClick={() => {
                            this.startTimer()
                        }}>Start Timer</Button>
                    </div>
                    :
                    <>
                        <table>
                            <thead style={{textDecoration: "underline"}}>
                                <tr>
                                    <th>Shot Number</th>
                                    <th>Split</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.filterShots(this.props.shots, this.state.showShotsAfter).map((value, index) => {
                                    return <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{value.split / 1000}</td>
                                    </tr>
                                })}
                            </tbody>
                        </table>

                        {this.state.status === "started" ?
                            <div className={"text-center"} style={{marginTop: "20px"}}>
                                <Button variant="danger" onClick={() => {
                                    this.stopTimer()
                                }}>Stop Timer</Button>
                            </div>
                            :
                            <div className={"text-center"} style={{marginTop: "20px"}}>
                                <Button variant="danger" onClick={() => {
                                    this.resetTimer()
                                }}>Reset Timer</Button>
                            </div>
                        }
                    </>
                }
            </Card>
        );
    }
}

const mapStateToProps = state => ({
    shots: state.shotTracker.shots
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({setTimer}, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ShotTimer);
