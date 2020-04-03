import React from 'react';
import {Button, Form} from "react-bootstrap";
import Card from "../Card";

class ShotTimer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            delay: 0.5,
            status: "reset",
            start: null,
            shots: [],
        }
    }

    componentDidMount() {
        window.createjs.Sound.registerSound("/assets/sounds/timerbeep.wav", "Beep");
    }

    startTimer() {

        this.setState({
            status: "started"
        }, () => {
            if (this.props.timerType === "running") {
                this.delay = setTimeout(() => {
                    this.setState({
                        start: new Date(),
                    }, () => {
                        window.createjs.Sound.play("Beep");
                    })
                }, this.state.delay * 1000)
            } else {
                this.interval = setInterval(() => {
                    this.setState({
                        start: new Date(),
                    }, () => {
                        window.createjs.Sound.play("Beep");
                    })
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
        })
    }

    resetTimer() {
        this.setState({
            status: "reset",
            shots: [],
            start: null
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
                                {this.state.shots.map((value, index) => {
                                    return <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{value / 1000}</td>
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

export default ShotTimer;
