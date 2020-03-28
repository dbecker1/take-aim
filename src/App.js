import React from 'react';
import './App.css';
import CameraFeed from "./CameraFeed";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cvLoaded: false
        }
    }


    componentDidMount() {
        window.onOpenCV = () => this.setState({ cvLoaded: true });
    }

    render() {
        if (this.state.cvLoaded) {
            return (
                <div className="App">
                    {/*<header className="App-header">*/}
                    <h1>
                        Webcam Feed
                    </h1>
                    <CameraFeed />
                    {/*</header>*/}
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
