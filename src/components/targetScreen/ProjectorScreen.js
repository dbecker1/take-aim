import React from 'react';
import NewWindow from "react-new-window";
import {backgroundColor, color} from "../../config";
import {Button, Col, Row} from "react-bootstrap";
import TargetCanvas from "./TargetCanvas";
import {bindActionCreators} from "redux";
import {finishResize} from "../../app/slices/projectorSlice";
import {connect} from "react-redux";

const WINDOW_NAME = "com_sharpshooter_projectorwindow"


class ProjectorScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            height: 0,
            width: 0,
        }

        this.windowRef = React.createRef();
        this.updateSize.bind(this)
    }

    componentWillMount() {
        let toOpen = window.open("", WINDOW_NAME);
        toOpen.close();
    }

    componentDidMount() {
        this.windowRef.current.window.addEventListener("resize", (e) => {this.updateSize(e)})
    }

    componentWillUnmount() {
        this.windowRef.current. window.removeEventListener('resize', (e) => {this.updateSize(e)});

    }

    updateSize(e) {
        this.setState({
            height: e.target.innerHeight,
            width: e.target.innerWidth
        })
    }

    doneResizing() {
        this.props.finishResize({
            canvasHeight: this.state.height * .8,
            canvasWidth: this.state.width * .8
        })
    }

    renderScreen() {
        if (!this.props.resized) {
            return (
                <Row>
                    <Col sm={12} className={"text-center"}>
                        <h1>Put this screen on your projector!</h1>
                        <h3>Resize the window to take the full screen and then click the button below</h3>
                        <p>Height: {this.state.height}<br />Width: {this.state.width}</p>
                        <Button variant="customPrimary" onClick={() => {this.doneResizing()}}>I'm done resizing!</Button>
                    </Col>
                </Row>
            );
        } else {
            return (
                <>
                    <Row>
                        <Col sm={12} className={"text-center"}>
                            <h1>Take Aim Target Screen</h1>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={12} className={"text-center"}>
                            <TargetCanvas />
                        </Col>
                    </Row>
                </>
            )

        }
    }

    render() {
        return (
            <NewWindow ref={this.windowRef} name={WINDOW_NAME}>
                <div style={{ height: "100vh", width: "100vw", backgroundColor: backgroundColor, color: color}}>
                    {this.renderScreen()}
                </div>
            </NewWindow>
        );
    }
}


const mapStateToProps = state => ({
    resized: state.projector.resized
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({finishResize}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ProjectorScreen)