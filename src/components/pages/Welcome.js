import React from 'react';
import Page from '../Page';
import {Row, Col, Button} from "react-bootstrap";

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
        return (
            <Page>
                <Row>
                    <Col sm={12} className={"text-center"}>
                        <p>Welcome to Take Aim!</p>

                        {this.state.status === "welcome" ?
                            <>
                                <p>
                                    Take Aim is an open source laser dry fire simulation system. In order to use Take Aim, you will need:
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
    }

}

export default Welcome;