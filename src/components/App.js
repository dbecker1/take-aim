import React from 'react';
import '../styles/App.css';
import TargetScreenManager from "../util/TargetScreenManager";

import Loading from "./pages/Loading";
import Welcome from "./pages/Welcome";
import CalibrateLaser from "./pages/CalibrateLaser";
import CalibrateWebcam from "./pages/CalibrateWebcam";
import TargetSelection from "./pages/TargetSelection";
import Shoot from "./pages/Shoot";

import ProjectorScreen from "./ProjectorScreen";

import {Container, Row, Col} from "react-bootstrap";
import {backgroundColor, color, color4} from "../config";


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cvLoaded: false,
            launchWindow: false,
            currentPage: "welcome",
            showVideo: false,
            projectorReady: false
        }

        this.targetScreenManager = new TargetScreenManager();
        this.videoRef = React.createRef();
    }

    componentDidMount() {
        window.onOpenCV = () => {console.log("OpenCV Loaded");this.setState({ cvLoaded: true })};

        const video = this.videoRef.current;
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then((stream)  => {
                video.srcObject = stream;
                video.play();
            })
            .catch((err) => {
                console.log("An error occurred! " + err);
            });
    }

    changePage(name) {
        this.setState({
            currentPage: name
        })
    }

    toggleVideo() {
        this.setState({
            showVideo: !this.state.showVideo
        })
    }

    getComponent(name) {
        if (name === "welcome") {
            return (
                <Welcome launchProjector={() => {
                             console.log("Launch Projector!");
                             this.setState({launchWindow: true})
                         }}
                         changePage={(name) => {this.changePage(name)}}
                         projectorReady={this.state.projectorReady}
                />
            )
        } else if (name === "calibrateLaser") {
            return (
                <CalibrateLaser changePage={(name) => {this.changePage(name)}}
                                videoRef={this.videoRef}/>
            )
        } else if (name === "calibrateWebcam") {
            return (
                <CalibrateWebcam targetScreenManager={this.targetScreenManager}
                                 changePage={(name) => this.changePage(name)}
                                 videoRef={this.videoRef}/>
            )
        } else if (name === "targetSelection") {
            return (
                <TargetSelection targetScreenManager={this.targetScreenManager}
                                 changePage={(name) => {this.changePage(name)}}
                />
            )
        } else if (name === "shoot") {
            return (
                <Shoot targetScreenManager={this.targetScreenManager}
                       changePage={(name) => {this.changePage(name)}}
                       videoRef={this.videoRef}/>
            )
        } else {
            return (
                <Loading changePage={(name) => {this.changePage(name)}} />
            )
        }
    }

    render() {
        return (
            <>
                <section className={"page"} style={{backgroundColor: backgroundColor, color: color}}>
                    <div className={"header"}>
                        <div style={{borderBottom: "1px solid white"}}>
                            <h1>Take Aim</h1>
                        </div>
                    </div>
                    <Container>
                        {this.getComponent(this.state.currentPage)}
                    </Container>
                </section>
                {this.state.launchWindow &&
                    <ProjectorScreen targetScreenManager={this.targetScreenManager}  onResizeFinish={() => {this.setState({projectorReady: true})}}/>
                }
                <div style={{position:"absolute", bottom: 5, left: 5, border: "5px solid " + backgroundColor, minWidth: "400px"}}>
                    <div style={{color: "white", backgroundColor: color4, width: "100%"}} className={"clearfix"}>
                        <div className={"float-left"}>
                            Webcam  Feed
                        </div>
                        <div className={"float-right"}>
                            <span style={{textDecoration: "underline", cursor:"pointer"}} onClick={() => {this.toggleVideo()}}>
                                {this.state.showVideo ? "Hide" : "Show"}
                            </span>
                        </div>
                    </div>
                    <div style={{display: this.state.showVideo ? "block" : "none"}}>
                        <video ref={this.videoRef} />
                    </div>
                </div>
            </>
        )
    }

}

export default App;
