import React from 'react';
import Page from '../Page';
import {Row, Col, Button} from "react-bootstrap";
import {Redirect} from "react-router-dom";

class Welcome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: "welcome"
        }

        if (!!props.resized) {
            this.state.status = "resized"
        }
    }

    launchProjector() {
        this.setState({
            status: "launched"
        }, () => {
            if (!!this.props.launchProjector) {
                this.props.launchProjector();
            }
        })
    }

    static getDerivedStateFromProps(props, state) {
        if (!!props.resizeCompleted) {
            state["status"] = "resized"
            return state
        }
        return null;
    }

    render() {
        if (this.state.status === "welcome" || this.state.status === "launched") {
            return (
                <Page>
                    <Row>
                        <Col sm={12} className={"text-center"}>
                            <p>Welcome to Sharpshooter!</p>

                            {this.state.status === "welcome" ?
                                <>
                                    <p>
                                        Sharpshooter is an open source laser dry fire simulation system. In order to use Sharpshooter, you will need:
                                        <br />
                                        - Projector
                                        <br />
                                        - Webcam pointed towards projector screen
                                        <br />
                                        - Laser Cartridge or laser shooting dummy gun
                                        <br />
                                        - Google Chrome
                                    </p>
                                    <Button onClick={() => {this.launchProjector()}}>Launch Projector Screen</Button>
                                </>
                            :
                                <p>Move the popup window to your projector screen and resize it to continue</p>
                            }

                        </Col>
                    </Row>
                </Page>
            );
        } else if (this.state.status === "resized") {
            return (
                <Redirect to={"/calibrateLaser"} />
            )
        }

    }

}

export default Welcome;