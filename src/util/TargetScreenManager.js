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

    // showCalibrationScreen() {
    //     let image = new Image();
    //     image.onload = () => {
    //         this.ctx.drawImage(image, 0, 0, this.maxWidth, this.maxHeight);
    //     }
    //     image.src = "/assets/checkerboard.svg";
    // }

    showCalibrationScreen(cornerNumber) {
        let textCoordinates = {x: null, y: null};

        const textWidth = 125;

        switch(cornerNumber) {
            case 1:
                textCoordinates = {x: 20, y: 30}
                break;
            case 2:
                textCoordinates = {x: this.maxWidth - 30 - textWidth, y: 30}
                break;
            case 3:
                textCoordinates = {x: this.maxWidth - 30 - textWidth, y: this.maxHeight - 30}
                break;
            case 4:
                textCoordinates = {x: 20, y: this.maxHeight - 30}
                break;
        }

        this.wipeScreen();

        this.ctx.font = "20px Times"
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