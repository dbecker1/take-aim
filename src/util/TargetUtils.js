import cookie from "react-cookies";
import {all_targets} from "../components/modes/targets";

class TargetUtils {
    static scaleTarget(target, distance, canvasHeight, distanceToProjector = null, heightOfTargetArea = null) {
        if (distanceToProjector == null || heightOfTargetArea == null) {
            const config = cookie.load("scaleConfig")
            if (!config) {
                throw new Error("Missing scale config")
            }
             distanceToProjector = config.distanceToProjector;
             heightOfTargetArea = config.heightOfTargetArea;
        }
        let distanceInInches = distance * 12 * 3;

        let heightInInches = target.realHeight / distanceInInches * distanceToProjector;

        let pixelsPerInch = canvasHeight / heightOfTargetArea;

        return heightInInches * pixelsPerInch;
    }

    static getTargetByName(name) {
        let target = all_targets.filter(a => {return a.name === name})
        if (target.size === 0) {
            return null;
        }
        return target[0]
    }

    static loadTarget(name) {
        return new Promise((resolve, reject) => {
            const target = this.getTargetByName(name)

            if (target == null) {
                reject("Invalid target name.");
                return;
            }

            let targetImage = new Image()

            targetImage.onload = () => {
                resolve(targetImage)
            }

            targetImage.src = "/assets/targets/" + target.fileName;
        });
    }

    static getTargetWidthForHeight(targetImg, desiredHeight) {
        const scaleFactor = desiredHeight / targetImg.height;
        return scaleFactor * targetImg.width;
    }
}

export default TargetUtils