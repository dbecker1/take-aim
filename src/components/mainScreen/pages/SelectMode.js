import React from 'react';
import {Row, Col, Button} from "react-bootstrap";
import Card from "../../Card";
import {shootingModes} from "../shootingModes/shootingModes";
import ReactGA from "react-ga";
import PostWelcomePage from "./PostWelcomePage";
import {withRouter} from "react-router"
import {bindActionCreators} from "redux";
import {setShootingMode} from "../../../app/slices/shotSlice";
import {connect} from "react-redux";

class SelectMode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    selectMode(mode) {
        ReactGA.event({
            category: 'Shooting Mode',
            action: 'Selected Shooting Mode: ' + mode.name,
            label: mode.name
        });
        this.props.setShootingMode(mode.name);
        this.props.history.push("/shootingMode")
    }

    divideModes(modes) {
        let toReturn = [];

        let temp = []
        for (let i = 0; i < modes.length; i++) {
            if (i % 2 === 0) {
                temp = [];
                temp.push(modes[i]);
            } else {
                temp.push(modes[i]);
                toReturn.push(temp);
            }
        }

        if (temp.length === 1) {
            toReturn.push(temp);
        }

        return toReturn;
    }

    getModeCard(mode) {
        if (!mode) {
            return;
        }
        return (
            <Card style={{height: "100%"}}>
                <div className={"text-center"}>
                    <h4 style={{textDecoration: "underline"}}>{mode.name}</h4>
                    <p>{mode.description}</p>
                    <Button variant="customPrimary" disabled={mode.shootComponent === null} onClick={() => {this.selectMode(mode)}}>Select this mode!</Button>
                </div>
            </Card>
        )
    }


    render() {
        return (
            <PostWelcomePage>
                {this.divideModes(shootingModes).map((item, key) => {
                    return (
                        <Row style={{marginTop: "30px"}} key={key}>
                            <Col sm={6} md={{span: 4, offset: 2}}>
                                {this.getModeCard(item[0])}
                            </Col>
                            <Col sm={6} md={4}>
                                {this.getModeCard(item[1])}
                            </Col>
                        </Row>
                    )
                })}
            </PostWelcomePage>
        );
    }

}

const mapDispatchToProps = dispatch => {
    return bindActionCreators({setShootingMode}, dispatch)
}
export default withRouter(connect(null, mapDispatchToProps)(SelectMode));