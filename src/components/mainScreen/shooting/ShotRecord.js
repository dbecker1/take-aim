import React from 'react';
import Card from "../../Card";
import { connect } from "react-redux";

class ShotRecord extends React.Component {
    render() {
        let reversedShots = [...this.props.shots];
        reversedShots.reverse()
        return (
            <Card className={"text-center"}>
                <h4 style={{textDecoration: "underline"}}>Shot Record</h4>
                <div style={{maxHeight: "150px", overflowY: "scroll"}}>
                    <table style={{width: "100%", textAlign: "center"}}>
                        <thead style={{textDecoration: "underline"}}>
                        <tr>
                            <th>Shot Number</th>
                            <th>Region</th>
                            <th>Points</th>
                        </tr>
                        </thead>
                        <tbody>
                        {reversedShots.map((value, index) => {
                            let score = value.score;
                            if (!score) {
                                score = {
                                    name: "Miss",
                                    pointValue: 0
                                }
                            }
                            return <tr key={index}>
                                <td>{reversedShots.length - index}</td>
                                <td>{score.name}</td>
                                <td>{score.pointValue}</td>
                            </tr>
                        })}
                        </tbody>
                    </table>
                </div>
                <div id={"canvashere"}></div>
            </Card>
        );
    }
}

const mapStateToProps = state => ({
    shots: state.shotTracker.shots
});

export default connect(mapStateToProps)(ShotRecord);
