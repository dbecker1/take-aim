import React from 'react';
import NewWindow from "react-new-window";
import {Button, Container, Row, Col} from "react-bootstrap";

const WINDOW_NAME = "com_sharpshooter_projectorwindow"
class ProjectorScreenInner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            height: this.props.height,
            width: this.props.width,
            status: "resizing"
        }
        this.targetCanvasRef = React.createRef();
    }

    static getDerivedStateFromProps(props, state) {
        if (state.status === "resizing") {
            state.height = props.height;
            state.width = props.width;
            return state;
        }
        return null
    }

    doneResizing() {
        this.setState({
            status: "shooting"
        }, () => {
            this.props.targetScreenManager.attachCanvas(this.targetCanvasRef.current)
        })
    }

    componentWillUnmount() {
        this.props.targetScreenManager.detachCanvas();
    }

    render() {
        if (this.state.status === "resizing") {
            return (
                <Container>
                    <Row>
                        <Col sm={12} className={"text-center"}>
                            <h1>Put this screen on your projector!</h1>
                            <h3>Resize the window to take the full screen and then click the button below</h3>
                            <Button onClick={() => {this.doneResizing()}}>I'm done resizing!</Button>
                        </Col>
                    </Row>

                    <p>{this.state.height} {this.state.width}</p>
                </Container>
            );
        } else if (this.state.status === "shooting") {
            let canvasHeight = this.state.height * .8;
            let canvasWidth = this.state.width * .8;
            return (
                <>
                    <Container>
                        <Row>
                            <Col sm={12} className={"text-center"}>
                                <h1>SharpShooter Target Screen</h1>
                            </Col>
                        </Row>
                    </Container>
                    <div style={{textAlign: "center"}}>
                        <canvas height={canvasHeight}
                                width={canvasWidth}
                                style={{border: "1px solid black"}}
                                ref={this.targetCanvasRef}/>
                    </div>
                </>
            )

        } else {
            return (
                <h1>Uh oh! Something went wrong!</h1>
            )
        }

    }
}

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

    render() {
        return (
            <NewWindow ref={this.windowRef} name={WINDOW_NAME}>
                <ProjectorScreenInner height={this.state.height} width={this.state.width} targetScreenManager={this.props.targetScreenManager}/>
            </NewWindow>
        );
    }
}



export default ProjectorScreen;
