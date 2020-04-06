import React from 'react';
import '../styles/App.css';

import Loading from "./mainScreen/pages/Loading";
import Welcome from "./mainScreen/pages/Welcome";
import CalibrateLaser from "./mainScreen/pages/CalibrateLaser";
import CalibrateWebcam from "./mainScreen/pages/CalibrateWebcam";
import RunShootingMode from "./mainScreen/pages/RunShootingMode";

import ProjectorScreen from "./targetScreen/ProjectorScreen";

import {Container, Row, Col} from "react-bootstrap";
import {backgroundColor, color, color4} from "../config";
import SelectMode from "./mainScreen/pages/SelectMode";
import ReactGA from 'react-ga';

ReactGA.initialize('UA-162789074-1', { debug: false });

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cvLoaded: false,
            launchWindow: false,
            currentPage: "welcome",
            showVideo: false,
            shootingMode: null
        }

        ReactGA.pageview("welcome");
        this.videoRef = React.createRef();
    }

    componentDidMount() {
        window.onOpenCV = () => {console.log("OpenCV Loaded");this.setState({ cvLoaded: true })};

        const video = this.videoRef.current;
        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then((stream)  => {
                video.srcObject = stream;
                video.onplay = () => {
                    ReactGA.set({
                        videoWidth: video.videoWidth,
                        videoHeight: video.videoHeight
                    })
                }
                video.play();
            })
            .catch((err) => {
                console.log("An error occurred! " + err);
            });
    }

    changePage(name) {
        ReactGA.pageview(name);
        this.setState({
            currentPage: name
        })
    }

    setShootingMode(mode) {
        this.setState({
            shootingMode: mode
        }, () => {
            this.changePage("runShootingMode")
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
                />
            )
        } else if (name === "calibrateLaser") {
            return (
                <CalibrateLaser changePage={(name) => {this.changePage(name)}}
                                videoRef={this.videoRef}/>
            )
        } else if (name === "calibrateWebcam") {
            return (
                <CalibrateWebcam changePage={(name) => this.changePage(name)}
                                 videoRef={this.videoRef}/>
            )
        } else if (name === "selectMode") {
            return (
                <SelectMode setShootingMode={(mode) => {this.setShootingMode(mode)}}/>
            )
        } else if (name === "runShootingMode") {
            return (
                <RunShootingMode changePage={(name) => {this.changePage(name)}}
                                 videoRef={this.videoRef}
                                 shootingMode={this.state.shootingMode}/>
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
                            <img src={"/logo.svg"} style={{height: "100px", marginBottom: "10px"}}/>
                        </div>
                    </div>
                    <Container>
                        {this.getComponent(this.state.currentPage)}
                    </Container>
                </section>
                {this.state.launchWindow &&
                    <ProjectorScreen/>
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
