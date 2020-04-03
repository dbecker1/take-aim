import {all_targets} from "../components/modes/targets";
import TargetUtils from "./TargetUtils"

class TargetScreenManager {
    constructor() {
        console.log("Target Screen Manager constructed")
        this.canvas = null;
    }

    attachCanvas(canvas) {
        this.canvas = canvas
        this.maxHeight = canvas.height;
        this.maxWidth = canvas.width;
        this.ctx = canvas.getContext('2d');
        console.log("Target canvas attached");

        this.wipeScreen();
    }

    detachCanvas() {
        this.canvas = null
        console.log("Target canvas detached")
    }

    showCalibrationScreen(cornerNumber) {
        let textCoordinates = {x: null, y: null};

        const textWidth = 190;

        switch(cornerNumber) {
            case 1:
                textCoordinates = {x: 10, y: 30}
                break;
            case 2:
                textCoordinates = {x: this.maxWidth - 30 - textWidth, y: 30}
                break;
            case 3:
                textCoordinates = {x: this.maxWidth - 30 - textWidth, y: this.maxHeight - 10}
                break;
            case 4:
                textCoordinates = {x: 10, y: this.maxHeight - 10}
                break;
        }

        this.wipeScreen();

        this.ctx.font = "30px Times"
        this.ctx.fillStyle = "black"
        this.ctx.fillText("Click this corner!", textCoordinates.x, textCoordinates.y);
    }

    wipeScreen() {
        this.ctx.beginPath();
        this.ctx.rect(0, 0, this.maxWidth, this.maxHeight);
        this.ctx.fillStyle = "white";
        this.ctx.fill();
    }

    drawTarget(name) {
        return new Promise((resolve, reject) => {
            let target = TargetUtils.getTargetByName(name)

            if (target == null) {
                reject("Invalid target name");
                return;
            }

            TargetUtils.loadTarget(name).then(targetImage => {
                const targetHeight = this.maxHeight * .8;
                const targetWidth = TargetUtils.getTargetWidthForHeight(targetImage, targetHeight);
                let x = (this.maxWidth / 2) - (targetWidth / 2);
                let y = (this.maxHeight / 2) - (targetHeight / 2);
                this.ctx.drawImage(targetImage, x, y, targetWidth, targetHeight)
                resolve();
            })
        })

    }

    draw(src, x, y, width, height) {
        this.ctx.drawImage(src, x, y, width, height)
    }

    getDimensions() {
        return {
            canvasWidth: this.canvas.width,
            canvasHeight: this.canvas.height
        }
    }
}

export default TargetScreenManager;