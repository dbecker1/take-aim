import {addShot} from "./slices/shotSlice";
import TargetUtil from "../util/TargetUtils"

const checkBoundaries  = (target, pointCoordinates) => {
    if (pointCoordinates.x < target.x) {
        return false
    }
    if (pointCoordinates.x > target.x + target.width) {
        return false
    }
    if (pointCoordinates.y < target.y) {
        return false
    }
    if (pointCoordinates.y > target.y + target.height) {
        return false
    }
    return true
}

export const detectHitPoints = store => next => action => {
    if (action.type === addShot.type) {
        try {
            const state = store.getState();
            const currentTargets = state.targets;
            for (let i in currentTargets) {
                const currentTarget = currentTargets[i];
                if (checkBoundaries(currentTarget, action.payload.center)) {
                    const target = TargetUtil.getTargetByName(currentTarget.name)
                    const canvas = document.createElement("canvas");
                    canvas.width = currentTarget.width;
                    canvas.height = currentTarget.height;
                    const scaleTarget = currentTarget.requstedScaleHeight;
                    const ctx = canvas.getContext('2d');
                    const point = {
                        x: (action.payload.center.x - currentTarget.x) / scaleTarget,
                        y: (action.payload.center.y - currentTarget.y) / scaleTarget
                    }
                    if (target.hasOwnProperty("scoringZones")) {
                        let lowestPriority = Infinity;
                        for (let j in target.scoringZones) {
                            const zone = target.scoringZones[j];
                            const path = new Path2D(zone.path)
                            //ctx.moveTo(0, 0);
                            ctx.stroke(path);
                            if (ctx.isPointInPath(path, point.x, point.y)) {
                                if (zone.priority < lowestPriority) {
                                    action.payload.score = {
                                        pointValue: zone.pointValue,
                                        name: zone.name,
                                        targetId: currentTarget.id
                                    };
                                    lowestPriority = zone.priority;
                                }
                            }
                        }
                    }
                    // Uncommenting this can be helpful for debugging
                    // ctx.beginPath();
                    // ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI, false);
                    // ctx.fillStyle = 'green';
                    // ctx.fill();
                    // const text = document.createTextNode("scale: " + scaleTargets[i].scaleX + " x: " + point.x +  " y: " + point.y);
                    // document.getElementById("canvashere").appendChild(text);
                    // document.getElementById("canvashere").appendChild(canvas);
                }
            }
        } catch (e) {
            console.log("Error detecting hits");
            console.log(e)
        }
    }
    next(action);
}