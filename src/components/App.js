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


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cvLoaded: false,
            launchWindow: false,
            currentPage: "welcome"
        }

        this.targetScreenManager = new TargetScreenManager();
    }

    componentDidMount() {
        window.onOpenCV = () => {console.log("OpenCV Loaded");this.setState({ cvLoaded: true })};
    }

    changePage(name) {
        this.setState({
            currentPage: name
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
                <CalibrateLaser changePage={(name) => {this.changePage(name)}}/>
            )
        } else if (name === "calibrateProjector") {
            return (
                <CalibrateWebcam targetScreenManager={this.targetScreenManager}
                                 changePage={(name) => this.changePage(name)} />
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
                       changePage={(name) => {this.changePage(name)}} />
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
                {this.getComponent(this.state.currentPage)}
                {this.state.launchWindow &&
                    <ProjectorScreen targetScreenManager={this.targetScreenManager}  onResizeFinish={() => {this.changePage("calibrateLaser")}}/>
                }
            </>
        )
    }

}

export default App;
