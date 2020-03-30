import React from 'react';
import '../styles/App.css';
import TargetScreenManager from "../util/TargetScreenManager";

import Loading from "./pages/Loading";
import Welcome from "./pages/Welcome";
import CalibrateLaser from "./pages/CalibrateLaser";
import TargetSelection from "./pages/TargetSelection";
import Shoot from "./pages/Shoot";

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
            resizeCompleted: false,
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
        if (this.state.currentPage === "welcome") {
            return (
                <Welcome launchProjector={() => {
                    console.log("Launch Projector!");
                    this.setState({launchWindow: true})
                }}
                    // resizeCompleted={this.state.resizeCompleted}
                         changePage={(name) => {this.changePage(name)}}
                />
            )
        } else if (this.state.currentPage === "calibrateLaser") {
            return (
                <CalibrateLaser changePage={(name) => {this.changePage(name)}}/>
            )
        } else if (this.state.currentPage === "targetSelection") {
            return (
                <TargetSelection targetScreenManager={this.targetScreenManager}
                                 changePage={(name) => {this.changePage(name)}}
                />
            )
        } else if (this.state.currentPage === "shoot") {
            return (
                <Shoot changePage={(name) => {this.changePage(name)}} />
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

        // return (
        //     <BrowserRouter forceRefresh={!supportsHistory}>
        //         <div>
        //             <main>
        //                 <Route
        //                     render={({ location }) => {
        //                         const { pathname } = location;
        //                         return (
        //                             <TransitionGroup>
        //                                 <CSSTransition
        //                                     key={pathname}
        //                                     classNames="page"
        //                                     timeout={{
        //                                         enter: 1000,
        //                                         exit: 1000,
        //                                     }}
        //                                 >
        //                                     <Route
        //                                         location={location}
        //                                         render={() => (
        //                                             <Switch>
        //                                                 <Route
        //                                                     exact
        //                                                     path="/loading"
        //                                                     component={Loading}
        //                                                 />
        //                                                 <Route
        //                                                     exact
        //                                                     path="/calibrateLaser"
        //                                                     component={CalibrateLaser}
        //                                                 />
        //                                                 <Route
        //                                                     exact
        //                                                     path="/shoot"
        //                                                     component={Shoot}
        //                                                 />
        //                                                 <Route
        //                                                     exact
        //                                                     path="/targetSelection"
        //                                                     render={(props) =>
        //                                                         <TargetSelection {...props}
        //                                                             targetScreenManager={this.targetScreenManager}
        //                                                             />
        //                                                     }
        //                                                 />
        //                                                 <Route
        //                                                     path="/"
        //                                                     render={(props) =>
        //                                                         <Welcome {...props}
        //                                                             launchProjector={() => {
        //                                                                 console.log("Launch Projector!");
        //                                                                 this.setState({launchWindow: true})
        //                                                             }}
        //                                                              resizeCompleted={this.state.resizeCompleted}
        //                                                             />
        //                                                     }
        //                                                 />
        //                                             </Switch>
        //                                         )}
        //                                     />
        //                                 </CSSTransition>
        //                             </TransitionGroup>
        //                         );
        //                     }}
        //                 />
        //             </main>
        //         </div>
        //         {this.state.launchWindow &&
        //             <ProjectorScreen targetScreenManager={this.targetScreenManager}  onResizeFinish={() => {this.setState({resizeCompleted: true})}}/>
        //         }
        //     </BrowserRouter>
        //     )

    }

}

export default App;
