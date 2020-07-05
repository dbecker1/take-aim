import React from 'react';
import Card from "../../Card";
import { connect } from "react-redux";

class ShotRecord extends React.Component {
    render() {
        let reversedShots = [...this.props.shots];
        reversedShots.reverse()
        if (this.props.twoPlayerEnabled) {
            return (
                <div>
                    {this.renderCard("Player 1 Shot Record", reversedShots.filter(a => {return a.zone === "Player 1"}))}
                    {this.renderCard("Player 2 Shot Record", reversedShots.filter(a => {return a.zone === "Player 2"}))}
                </div>
            )
        } else {
            return (
                <div>
                    {this.renderCard("Shot Record", reversedShots)}
                </div>
            );
        }

    }

    renderCard(title, shots) {
        const total = shots.reduce((acc, cur) => {
            if (cur.hasOwnProperty("score") && !isNaN(cur.score.pointValue)) {
                return acc + cur.score.pointValue
            };
            return acc
        }, 0)
        return (
            <Card className={"text-center"} style={{marginBottom: "20px"}}>
                <h4 style={{textDecoration: "underline"}}>{title}</h4>
                <div style={{height: "150px", overflowY: "scroll"}}>
                    <table style={{width: "100%", textAlign: "center"}}>
                        <thead style={{textDecoration: "underline"}}>
                        <tr>
                            <th>Shot Number</th>
                            <th>Region</th>
                            <th>Points</th>
                        </tr>
                        </thead>
                        <tbody>
                        {shots.map((value, index) => {
                            let score = value.score;
                            if (!score) {
                                score = {
                                    name: "Miss",
                                    pointValue: 0
                                }
                            }
                            return <tr key={index}>
                                <td>{shots.length - index}</td>
                                <td>{score.name}</td>
                                <td>{score.pointValue}</td>
                            </tr>
                        })}
                        </tbody>
                    </table>
                </div>
                <div style={{paddingRight: "10px", paddingTop: "10px"}}>
                    <h6 className={"float-right"}>Total: {total}</h6>
                </div>
                <div id={"canvashere"}></div>
            </Card>
        );
    }
}

const mapStateToProps = state => ({
    shots: state.shotTracker.shots,
    twoPlayerEnabled: state.config.twoPlayer
});

export default connect(mapStateToProps)(ShotRecord);
