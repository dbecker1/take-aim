import React from "react";
import {connect} from "react-redux";
import TargetUtils from "../../util/TargetUtils";
import '../../styles/TargetCanvas.css';
import {bindActionCreators} from "redux";
import {finishResize} from "../../app/slices/projectorSlice";
import {updateFabricObject, setTargetRenderScales} from "../../app/slices/fabricSlice";


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
        let promises = []
        let scaleTargets = []
        for (const i in props.targets) {
            const targetDetails = props.targets[i];
            const target = TargetUtils.getTargetByName(targetDetails.name)

            let promise  = new Promise((resolve, reject) => {
                window.fabric.loadSVGFromURL("/assets/targets/" + target.fileName,  (objects, options) => {
                    var obj = window.fabric.util.groupSVGElements(objects, options);
                    const prevHeight =  obj.getScaledHeight()
                    const prevWidth = obj.getScaledWidth()
                    obj.scaleToHeight(targetDetails.height);
                    obj.scaleToWidth(targetDetails.width);
                    const postHeight =  obj.getScaledHeight()
                    const postWidth = obj.getScaledWidth()
                    const scale = {
                        scaleX: postWidth / prevWidth,
                        scaleY: postHeight / prevHeight
                    };
                    scaleTargets[i] = scale;
                    obj.left = targetDetails.x;
                    obj.top = targetDetails.y;
                    this.canvas.add(obj);
                    resolve();
                });
            })
            promises.push(promise);
        }

        // Draw Non-Target Elements
        for (const i in props.nonTargetElements) {
            const element = props.nonTargetElements[i];
            if (element.type === "text") {
                let textbox = new window.fabric.Textbox(element.text, {
                    top: element.top,
                    left: element.left,
                    width: element.width,
                    height: element.height,
                    fontSize: element.fontSize
                })
                this.canvas.add(textbox)
            }

            if (element.type === "svg") {
                let promise = new Promise((resolve, reject) => {
                    window.fabric.loadSVGFromURL("/assets/nonTargetImages/" + element.fileName, (objects, options) => {
                        var obj = window.fabric.util.groupSVGElements(objects, options);
                        obj.scaleToHeight(element.height);
                        obj.scaleToWidth(element.width);
                        obj.left = element.x;
                        obj.top = element.y;
                        this.canvas.add(obj);
                        resolve();
                    })
                });
                promises.push(promise);
            }
        }

        // Wait for targets to finish before saving object
        Promise.all(promises).then(result => {
            this.canvas.renderAll();
            let object = this.canvas.toObject()

            this.props.setTargetRenderScales(scaleTargets)
            this.props.updateFabricObject(object);
        }).catch(e =>{
            console.error(e)
        })

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
    return bindActionCreators({updateFabricObject, setTargetRenderScales}, dispatch)
}
export default connect(mapStateToProps, mapDispatchToProps)(TargetCanvas)