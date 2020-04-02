import React from 'react';
import {Row, Col, Button} from "react-bootstrap";
import Card from "../Card";
import {shootingModes} from "../modes/shootingModes";

class SelectMode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    selectMode(mode) {
        this.props.setShootingMode(mode);
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
            <Card>
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
            <>
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
                {/*<Row>*/}
                {/*    <Col sm={12} className={"text-center"}>*/}
                {/*        <p>Select a shooting mode!</p>*/}
                {/*    </Col>*/}
                {/*</Row>*/}
                {/*<Row style={{marginTop: "30px"}}>*/}
                {/*    <Col sm={6} md={{span: 4, offset: 2}}>*/}
                {/*        <Card >*/}
                {/*            <div className={"text-center"}>*/}
                {/*                <h4 style={{textDecoration: "underline"}}>Standard Target Shooting</h4>*/}
                {/*                <p>Stationary targets at a fixed distance</p>*/}
                {/*                <Button variant="customPrimary">Select this mode!</Button>*/}
                {/*            </div>*/}
                {/*        </Card>*/}
                {/*    </Col>*/}
                {/*    <Col sm={6} md={4}>*/}
                {/*        <Card >*/}
                {/*            <div className={"text-center"}>*/}
                {/*                <h4 style={{textDecoration: "underline"}}>Coming Soon!</h4>*/}
                {/*                <p>Probably something really cool</p>*/}
                {/*                <Button variant="customPrimary" disabled>Select this mode!</Button>*/}
                {/*            </div>*/}
                {/*        </Card>*/}
                {/*    </Col>*/}
                {/*</Row>*/}
                {/*<Row style={{marginTop: "30px"}}>*/}
                {/*    <Col sm={6} md={{span: 4, offset: 2}}>*/}
                {/*        <Card >*/}
                {/*            <div className={"text-center"}>*/}
                {/*                <h4 style={{textDecoration: "underline"}}>Coming Soon!</h4>*/}
                {/*                <p>Probably something really cool</p>*/}
                {/*                <Button variant="customPrimary" disabled>Select this mode!</Button>*/}
                {/*            </div>*/}
                {/*        </Card>*/}
                {/*    </Col>*/}
                {/*    <Col sm={6} md={4}>*/}
                {/*        <Card >*/}
                {/*            <div className={"text-center"}>*/}
                {/*                <h4 style={{textDecoration: "underline"}}>Coming Soon!</h4>*/}
                {/*                <p>Probably something really cool</p>*/}
                {/*                <Button variant="customPrimary" disabled>Select this mode!</Button>*/}
                {/*            </div>*/}
                {/*        </Card>*/}
                {/*    </Col>*/}
                {/*</Row>*/}
            </>
        );
    }

}

export default SelectMode;