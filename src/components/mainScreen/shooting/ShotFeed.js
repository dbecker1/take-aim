import React from 'react';
import ShotDetector from "../../../util/ShotDetector"
import cookie from 'react-cookies'
import { connect } from "react-redux";
import { addShot, wipeShots } from "../../../app/slices/shotSlice";
import { bindActionCreators } from "redux";
import "../../../styles/TargetCanvas.css";
import GoogleAnalyticsUtils from "../../../util/GoogleAnalyticsUtils";
import TargetCanvas from "../../TargetCanvas"

// helpful for debugging/development without an entire setup
const ENABLE_CLICK_TO_SHOOT = true

class ShotFeed extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            running: false,
            scale: null
        }

        this.canvasRef = React.createRef();
        this.canvasParentRef = React.createRef();

    }

    componentDidMount() {
        this.startProcessing();
    }

    componentWillUnmount() {
        if (!!this.shotDetector) {
            this.shotDetector.stop();
        }
    }

    updateNoise(e) {
        let checked = e.target.checked;
        this.shotDetector.filterNoise = checked;
    }

    componentWillReceiveProps(nextProps, nextContext) {
        // this.redrawCanvas(nextProps)
    }

    startProcessing() {
        this.props.wipeShots();
        this.setState({
            running: true
        }, () => {
            const laserConfig = cookie.load("laserConfig")
            if (laserConfig === null){
                console.error("Missing laser config")
            }
            const webcamConfig = cookie.load("webcamConfig")
            if (webcamConfig === null) {
                console.error("Missing webcam config");
            }
            const outputDimensions = this.props.outputDimensions
            if (!this.shotDetector) {
                this.shotDetector = new ShotDetector(this.props.videoRef.current, laserConfig.h, laserConfig.s, laserConfig.v,
                    laserConfig.hRadius, laserConfig.sRadius, laserConfig.vRadius, webcamConfig.corners,
                    outputDimensions, 100);
            }

            const parentWidth = this.canvasParentRef.current.offsetWidth * .9;
            const windowHeight = window.innerHeight * .6;
            let scaleColumns = parentWidth / outputDimensions.columns
            let scaleRows = windowHeight / outputDimensions.rows
            if (scaleColumns < scaleRows) {
                scaleRows = scaleColumns
            }
            this.setState({
                scale: scaleRows
            })

            this.shotDetector.start((hit => {
                GoogleAnalyticsUtils.event({
                    category: 'Shot Feed',
                    action: "Shot Detected",
                    label: "Radius: " + hit.radius
                });
                this.props.addShot(hit);
                console.log(hit)
            }))
        })
    }

    stop() {
        this.shotDetector.stop();
    }

    onTargetCanvasClick(point) {
        if (ENABLE_CLICK_TO_SHOOT) {
            let shot = {
                center: {
                    x: point.x / this.state.scale,
                    y: point.y / this.state.scale,
                },
                radius: 5,  // arbitrary
                timestamp: new Date()
            };
            this.props.addShot(shot);
            console.log("MANUAL SHOT")
            console.log(shot)
        }
    }

    render() {
        return (
            <div ref={this.canvasParentRef}>
                <div className={"text-center"}>
                    {this.state.scale != null && <TargetCanvas scaleFactor={this.state.scale} shotMode={"standard"} onClick={(point) => {
                        this.onTargetCanvasClick(point)
                    }}/>}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    outputDimensions: {
        rows: state.projector.canvasHeight,
        columns: state.projector.canvasWidth
    },
    shots: state.shotTracker.shots,
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({addShot, wipeShots}, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps, null, {forwardRef: true})(ShotFeed);
