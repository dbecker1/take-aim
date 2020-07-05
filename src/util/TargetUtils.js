import cookie from "react-cookies";
import {all_targets} from "../components/mainScreen/shootingModes/targets";

class TargetUtils {
    static targetImageCache = {};
    static nonTargetImageCache = {};

    static scaleTarget(target, distance, canvasHeight, distanceToProjector = null, heightOfTargetArea = null) {
        return TargetUtils.scale(target.realHeight, distance, canvasHeight, distanceToProjector, heightOfTargetArea);
    }

    static scale(realHeight, distance, canvasHeight,  distanceToProjector = null, heightOfTargetArea = null) {
        if (distanceToProjector == null || heightOfTargetArea == null) {
            const config = cookie.load("scaleConfig")
            if (!config) {
                throw new Error("Missing scale config")
            }
            distanceToProjector = config.distanceToProjector;
            heightOfTargetArea = config.heightOfTargetArea;
        }
        let distanceInInches = distance * 12 * 3;

        let heightInInches = realHeight / distanceInInches * distanceToProjector;

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
            if (TargetUtils.targetImageCache.hasOwnProperty(name)) {
                console.log("Fetching cached image!");
                resolve(TargetUtils.targetImageCache[name])
            } else {
                const target = this.getTargetByName(name)

                if (target == null) {
                    reject("Invalid target name.");
                    return;
                }

                let targetImage = new Image()

                targetImage.onload = () => {
                    TargetUtils.targetImageCache[name] = targetImage
                    resolve(targetImage)
                }

                targetImage.src = "/assets/targets/" + target.fileName;
            }
        });
    }

    static loadNonTargetImage(fileName) {
        return new Promise((resolve, reject) => {
            if (TargetUtils.nonTargetImageCache.hasOwnProperty(fileName)) {
                console.log("Fetching cached image!");
                resolve(TargetUtils.nonTargetImageCache[fileName])
            } else {
                let image = new Image()

                image.onload = () => {
                    TargetUtils.nonTargetImageCache[fileName] = image
                    resolve(image)
                }

                image.src = "/assets/nonTargetImages/" + fileName;
            }
        })
    }

    static getTargetWidthForHeight(targetImg, desiredHeight) {
        const scaleFactor = desiredHeight / targetImg.height;
        return scaleFactor * targetImg.width;
    }
}

export default TargetUtils