import React from 'react';
import Card from "../Card";
import { connect } from "react-redux";

class ShotRecord extends React.Component {
    render() {
        return (
            <Card className={"text-center"}>
                <h4 style={{textDecoration: "underline"}}>Shot Record</h4>
                <table>
                    <thead style={{textDecoration: "underline"}}>
                    <tr>
                        <th>Shot Number</th>
                        <th>Region</th>
                        <th>Points</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.props.shots.map((value, index) => {
                        let score = value.score;
                        if (!score) {
                            score = {
                                name: "Miss",
                                pointValue: 0
                            }
                        }
                        return <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{score.name}</td>
                            <td>{score.pointValue}</td>
                        </tr>
                    })}
                    </tbody>
                </table>
            </Card>
        );
    }
}

const mapStateToProps = state => ({
    shots: state.shotTracker.shots
});

export default connect(mapStateToProps)(ShotRecord);
