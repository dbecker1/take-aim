import React from "react";
import {connect} from "react-redux";
import ReactGA from 'react-ga';
import {Redirect} from "react-router-dom";

class PostLaunchPage extends React.Component {
    componentDidMount() {
        ReactGA.pageview(window.location.pathname + window.location.search);
    }

    render() {
        if (this.props.projectorLaunched) {
            return this.props.children
        } else {
            return <Redirect to={"/launch"} />
        }
    }
}

const mapStateToProps = state => ({
    projectorLaunched: state.projector.resized
});

export default connect(mapStateToProps)(PostLaunchPage)