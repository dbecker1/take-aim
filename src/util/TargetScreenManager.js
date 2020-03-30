import {all_targets} from "./targets";

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
    }

    detachCanvas() {
        this.canvas = null
        console.log("Target canvas detached")
    }

    showCalibrationScreen() {
        let image = new Image();
        image.onLoad = () => {
            this.ctx.drawImage(image, 0, 0, this.canvas.height, this.canvas.width);
        }
        image.src = "/assets/checkerboard.svg";
    }

    drawTarget(name) {
        let target = all_targets.filter(a => {return a.name === name})
        if (target.size === 0) {
            console.error("Invalid target name");
            return;
        }
        target = target[0];

        let targetImage = new Image()

        targetImage.onload = () => {
            const scaleFactor = (this.maxHeight * .6) / targetImage.height
            targetImage.height = this.maxHeight * .8
            targetImage.width = targetImage.width * scaleFactor
            let x = (this.maxWidth / 2) - (targetImage.width / 2);
            let y = (this.maxHeight / 2) - (targetImage.height / 2);
            this.ctx.drawImage(targetImage, x, y, targetImage.width, targetImage.height)
        }
        targetImage.src = "/assets/targets/" + target["fileName"];
    }
}

export default TargetScreenManager;