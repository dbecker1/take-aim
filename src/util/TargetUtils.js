import cookie from "react-cookies";
import {all_targets} from "../components/mainScreen/shootingModes/targets";
import {all_non_targets} from "../components/mainScreen/shootingModes/nonTargets";

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


    static getNonTargetByName(name) {
        let nonTarget = all_non_targets.filter(a => {return a.name === name})
        if (nonTarget.size === 0) {
            return null;
        }
        return nonTarget[0]
    }


    static getTargetWidthForHeight(targetName, desiredHeight) {
        var target = TargetUtils.getTargetByName(targetName)
        if (!target) {
            target = TargetUtils.getNonTargetByName(targetName);
        }
        const scaleFactor = desiredHeight / target.defaultHeight;
        return scaleFactor * target.defaultWidth;
    }
}

export default TargetUtils