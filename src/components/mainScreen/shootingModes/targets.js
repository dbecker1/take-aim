import BasicSilhouette from "./svgs/BasicSilhouette"
import TreePlate from "./svgs/TreePlate"
import TreePlateFlipped from "./svgs/TreePlateFlipped"
import USPSA from "./svgs/USPSA"
import Bullseye from "./svgs/Bullseye"

export let basic_silhouette = {
    name: "basic_silhouette",
    fileName: "basic_silhouette.svg",
    displayName: "Basic Silhouette Target",
    realHeight: 36,
    stationary: true,
    component: BasicSilhouette,
    defaultWidth: 217.01,
    defaultHeight:  428.85,
    scoringZones: [
        {
            name: "Bullseye",
            pathDataName: "10-ring",
            pointValue: 10,
        },
        {
            name: "9",
            pathDataName: "9-ring",
            pointValue: 9,
        },
        {
            name: "8",
            pathDataName: "8-ring",
            pointValue: 8,
        },
        {
            name: "7",
            pathDataName: "7-ring",
            pointValue: 7,
        },
        {
            name: "6",
            pathDataName: "6-ring",
            pointValue: 6,
        }
    ]
};

export let uspsa = {
    name: "uspsa_standard",
    fileName: "uspsa.svg",
    displayName: "USPSA Standard Target",
    realHeight: 36,
    stationary: true,
    component: USPSA,
    defaultWidth: 237,
    defaultHeight: 377.82,
    scoringZones: [
        {
            name: "A - Head",
            pathDataName: "A-head-target",
            pointValue: 5,
        },
        {
            name: "A - Body",
            pathDataName: "A-body-target",
            pointValue: 5,
        },
        {
            name: "B",
            pathDataName: "B-target",
            pointValue: 4,
        },
        {
            name: "C",
            pathDataName: "C-target",
            pointValue: 3,
        },
        {
            name: "D",
            pathDataName: "D-target",
            pointValue: 2,
        }
    ]
};

export let treePlate = {
    name: "tree_plate",
    fileName: "tree_plate.svg",
    displayName: "Dueling Tree Plate",
    realHeight: 6,
    stationary: false,
    component: TreePlate,
    defaultWidth: 69,
    defaultHeight: 59,
    scoringZones: [
        {
            name: "Plate Hit",
            pathDataName: "plate",
            pointValue: 1,
        }
    ]
};

export let treePlateFlipped = {
    name: "tree_plate_flipped",
    fileName: "tree_plate_flipped.svg",
    displayName: "Dueling Tree Plate (Flipped)",
    realHeight: 6,
    stationary: false,
    component: TreePlateFlipped,
    defaultWidth: 69,
    defaultHeight: 59,
    scoringZones: [
        {
            name: "Plate Hit",
            pathDataName: "plate-flipped",
            pointValue: 1,
        }
    ]
}

export let bullseye = {
    name: "bullseye",
    fileName: "bullseye.svg",
    displayName: "Bullseye",
    realHeight: 12,
    stationary: true,
    component: Bullseye,
    defaultWidth: 251,
    defaultHeight: 251,
    scoringZones: [
        {
            name: "Bullseye",
            pathDataName: "10-ring",
            pointValue: 10,
        },
        {
            name: "8",
            pathDataName: "8-ring",
            pointValue: 8,
        },
        {
            name: "6",
            pathDataName: "6-ring",
            pointValue: 6,
        },
        {
            name: "4",
            pathDataName: "4-ring",
            pointValue: 4,
        }
    ]
}

export const all_targets = [basic_silhouette, uspsa, treePlate, treePlateFlipped, bullseye];