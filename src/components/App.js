import React from 'react';
import '../styles/App.css';
import CameraFeed from "./CameraFeed";
import ProjectorScreen from "./ProjectorScreen";
import TargetScreenManager from "../util/TargetScreenManager";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cvLoaded: false,
        }

        this.targetScreenManager = new TargetScreenManager();
        this.cameraFeedRef = React.createRef();
    }

    start() {
        this.cameraFeedRef.current.startProcessing();
        this.targetScreenManager.drawTarget("basic_silhouette")
    }


    componentDidMount() {
        window.onOpenCV = () => this.setState({ cvLoaded: true });
    }

    render() {
        if (this.state.cvLoaded) {
            return (
                <div className="App">
                    <h1>
                        SharpShooter
                    </h1>
                    <CameraFeed ref={this.cameraFeedRef}/>
                    <button onClick={() => {this.start()}} >Start</button>

                    <ProjectorScreen targetScreenManager={this.targetScreenManager}/>
                </div>
            );
        } else {
            return (
                <h1>Loading</h1>
            )
        }

    }

}

export default App;
