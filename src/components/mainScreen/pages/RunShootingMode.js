import React from 'react';
import {Row, Col} from "react-bootstrap";
import ShotFeed from "../shooting/ShotFeed";
import PostWelcomePage from "./PostWelcomePage";
import {connect} from "react-redux";
import {shootingModes} from "../shootingModes/shootingModes";

class RunShootingMode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: "configure",
            settings: {}
        }
    }

    render() {
        let mode = shootingModes.filter(a => {return a.name === this.props.shootingMode})
        if (mode.length > 0) {
            mode = mode[0]
        } else {
            return <PostWelcomePage></PostWelcomePage>
        }
        return (
            <PostWelcomePage>
                <Row>
                    <Col sm={12} className={"text-center"}>
                        <h4 style={{textDecoration: "underline"}}>{this.props.shootingMode.name}</h4>
                    </Col>
                </Row>
                {this.state.status === "configure" ?
                    <mode.configureComponent saveSettings={(settings) => {this.setState({settings: settings, status: "shoot"})}}/>
                :
                    <mode.shootComponent settings={this.state.settings}
                                                            videoRef={this.props.videoRef}
                                                            backToSettings={() => {this.setState({status: "configure"})}}/>
                }

            </PostWelcomePage>
        );
    }

}

const mapStateToProps = state => ({
    shootingMode: state.shotTracker.shootingMode
})
export default connect(mapStateToProps)(RunShootingMode);