import React from 'react';
import '../styles/App.css';
import TargetScreenManager from "../util/TargetScreenManager";

import Loading from "./pages/Loading";
import Welcome from "./pages/Welcome";

import {
    Route,
    Switch,
    BrowserRouter,
    Redirect
} from 'react-router-dom';
import {
    CSSTransition,
    TransitionGroup
} from 'react-transition-group';
import ProjectorScreen from "./ProjectorScreen";

const supportsHistory = 'pushState' in window.history;

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cvLoaded: false,
            launchWindow: false,
            resizeCompleted: false
        }

        this.targetScreenManager = new TargetScreenManager();
        this.cameraFeedRef = React.createRef();
    }

    start() {
        this.targetScreenManager.drawTarget("basic_silhouette")

        setTimeout(() => {this.cameraFeedRef.current.startProcessing()}, 500);
    }


    componentDidMount() {
        window.onOpenCV = () => {console.log("OpenCV Loaded");this.setState({ cvLoaded: true })};
    }

    render() {
        return (
            <BrowserRouter forceRefresh={!supportsHistory}>
                <div>
                    <main>
                        <Route
                            render={({ location }) => {
                                const { pathname } = location;
                                return (
                                    <TransitionGroup>
                                        <CSSTransition
                                            key={pathname}
                                            classNames="page"
                                            timeout={{
                                                enter: 1000,
                                                exit: 1000,
                                            }}
                                        >
                                            <Route
                                                location={location}
                                                render={() => (
                                                    <Switch>
                                                        <Route
                                                            path="/"
                                                            render={(props) =>
                                                                <Welcome {...props}
                                                                    launchProjector={() => {
                                                                        console.log("Launch Projector!");
                                                                        this.setState({launchWindow: true})
                                                                    }}
                                                                     resizeCompleted={this.state.resizeCompleted}
                                                                    />
                                                            }
                                                        />
                                                        <Route
                                                            exact
                                                            path="/loading"
                                                            component={Loading}
                                                        />
                                                    </Switch>
                                                )}
                                            />
                                        </CSSTransition>
                                    </TransitionGroup>
                                );
                            }}
                        />
                    </main>
                </div>
                {this.state.launchWindow &&
                    <ProjectorScreen targetScreenManager={this.targetScreenManager}  onResizeFinish={() => {this.setState({resizeCompleted: true})}}/>
                }
            </BrowserRouter>
            )

    }

}

export default App;
