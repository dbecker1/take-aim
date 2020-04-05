import React from "react";
import {Button, Col, Row} from "react-bootstrap";
import {bindActionCreators} from "redux";
import {finishResize} from "../../app/slices/projectorSlice";
import {connect} from "react-redux";
import TargetCanvas from "./TargetCanvas";

class ProjectorScreenInner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            height: this.props.height,
            width: this.props.width,
        }
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
        this.props.finishResize({
            height: this.state.height,
            width: this.state.width
        })
    }

    render() {

    }
}

const mapStateToProps = state => ({
    resized: state.projector.resized
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({finishResize}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(ProjectorScreenInner)