import React from 'react';
import {Row, Col} from "react-bootstrap";
import ShotFeed from "../shooting/ShotFeed";

class RunShootingMode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: "configure",
            settings: {}
        }
    }

    render() {
        return (
            <>
                <Row>
                    <Col sm={12} className={"text-center"}>
                        <h4 style={{textDecoration: "underline"}}>{this.props.shootingMode.name}</h4>
                    </Col>
                </Row>
                {this.state.status === "configure" ?
                    <this.props.shootingMode.configureComponent saveSettings={(settings) => {this.setState({settings: settings, status: "shoot"})}}/>
                :
                    <this.props.shootingMode.shootComponent settings={this.state.settings}
                                                            videoRef={this.props.videoRef}
                                                            backToSettings={() => {this.setState({status: "configure"})}}/>
                }

            </>
        );
    }

}

export default RunShootingMode;