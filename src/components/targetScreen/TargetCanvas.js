import React from "react";
import {connect} from "react-redux";
import TargetUtils from "../../util/TargetUtils";
import '../../styles/TargetCanvas.css';
import {bindActionCreators} from "redux";
import {finishResize} from "../../app/slices/projectorSlice";
import {updateFabricObject} from "../../app/slices/fabricSlice";


class TargetCanvas extends React.Component{
    constructor(props) {
        super(props);
        this.state = {

        }

        this.canvasRef = React.createRef();
    }

    componentDidMount() {
        this.canvas = new window.fabric.Canvas(this.canvasRef.current)

        this.renderCanvas(this.props);
    }

    componentWillReceiveProps(nextProps) {
        const currentProps  =  {
            canvasDimensions: this.props.canvasDimensions,
            nonTargetElements: this.props.nonTargetElements,
            targets: this.props.targets
        }

        const newProps ={
            canvasDimensions: nextProps.canvasDimensions,
            nonTargetElements:  nextProps.nonTargetElements,
            targets: nextProps.targets
        }
        if (JSON.stringify(currentProps) !== JSON.stringify(newProps))  {
            this.renderCanvas(nextProps);
        }
    }

    renderCanvas(props) {
        // Wipe Canvas
        this.canvas.remove(...this.canvas.getObjects());

        // White Background
        const maxWidth = props.canvasDimensions.width;
        const maxHeight = props.canvasDimensions.height;
        this.canvasRef.current.width = maxWidth;
        this.canvasRef.current.height = maxHeight;
        let background =  new window.fabric.Rect({
            left: 0,
            top: 0,
            fill: "white",
            width: maxWidth,
            height: maxHeight
        });
        this.canvas.add(background);

        // Draw Targets
        let targetPromises = []
        for (const i in props.targets) {
            const targetDetails = props.targets[i];
            const target = TargetUtils.getTargetByName(targetDetails.name)

            let promise  = new Promise((resolve, reject) => {
                window.fabric.loadSVGFromURL("/assets/targets/" + target.fileName,  (objects, options) => {
                    var obj = window.fabric.util.groupSVGElements(objects, options);
                    obj.scaleToHeight(targetDetails.height);
                    obj.scaleToWidth(targetDetails.width);
                    obj.left = targetDetails.x;
                    obj.top = targetDetails.y;
                    this.canvas.add(obj).renderAll();
                    resolve();
                });
            })
            targetPromises.push(promise);
        }

        Promise.all(targetPromises).then(result => {
            let object = this.canvas.toObject()

            this.props.updateFabricObject(object);
        }).catch(e =>{
            console.error(e)
        })


        //  Draw Non-Target Elements
        //TODO
    }

    render() {
        return (
            <div style={{textAlign: "center"}}>
                <canvas height={this.props.canvasDimensions.height}
                        width={this.props.canvasDimensions.width}
                        style={{border: "1px solid black"}}
                        ref={this.canvasRef}/>
            </div>
        )
    }
}

const mapStateToProps  = state => ({
    canvasDimensions: {
        height: state.projector.canvasHeight,
        width: state.projector.canvasWidth
    },
    nonTargetElements: state.projector.nonTargetElements,
    targets: state.targets
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({updateFabricObject}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(TargetCanvas)