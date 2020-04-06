import {addShot} from "./slices/shotSlice";
import {all_targets} from "../components/modes/targets";

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
        const currentTargets = store.getState().targets;
        for (let i in currentTargets) {
            const currentTarget = currentTargets[i];
            if (checkBoundaries(currentTarget, action.payload.center)) {
                const target = all_targets.filter(a => {return a.name === currentTarget.name})[0];
                const canvas = document.createElement("canvas");
                const ctx = canvas.getContext('2d');
                if (target.hasOwnProperty("scoringZones")) {
                    let lowestPriority = Infinity;
                    for (let j in target.scoringZones) {
                        const zone = target.scoringZones[j];
                        const path = new Path2D(zone.path)
                        ctx.stroke(path);
                        if (ctx.isPointInPath(path, action.payload.center.x - currentTarget.x, action.payload.center.y - currentTarget.y)) {
                            if (zone.priority < lowestPriority) {
                                action.payload.score = {
                                    pointValue: zone.pointValue,
                                    name: zone.name
                                };
                                lowestPriority = zone.priority;
                            }
                        }
                    }
                }
            }
        }
    }
    next(action);
}