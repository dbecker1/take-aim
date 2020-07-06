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
            const popupWindow = window.open('', 'com_sharpshooter_projectorwindow');

            const relativeX = action.payload.center.x + state.projector.canvasX
            const relativeY = action.payload.center.y + state.projector.canvasY
            const elem = popupWindow.document.elementFromPoint(relativeX, relativeY)
            const parentElem = elem.parentElement
            console.log(parentElem);
            if (parentElem.hasAttribute("data-target-id") && elem.hasAttribute("data-name")) {
                const pathDataName = elem.getAttribute("data-name")
                const targetId = parentElem.getAttribute("data-target-id")
                const targetRecord = state.targets.filter(a => {return a.id === targetId})[0];

                const baseTarget = TargetUtil.getTargetByName(targetRecord.name)
                const scoreZone = baseTarget.scoringZones.filter(a => {return a.pathDataName === pathDataName})[0]
                action.payload.score = {
                    pointValue: scoreZone.pointValue,
                    name: scoreZone.name,
                    targetId: targetId
                }
            }
        } catch (e) {
            console.log("Error detecting hits");
            console.log(e)
        }
    }
    next(action);
}