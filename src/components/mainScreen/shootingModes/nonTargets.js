import TreeStand from "./svgs/TreeStand"
//In order to create scoring zones, take your SVG image and view the raw xml of it. Each zone should be defined by a
//single <path> tag. Take the "d" attribute of this tag (the one that defines the path) and put the resultant string
// in for the "path" of the scoringZone
export let tree_stand = {
    name: "tree_stand",
    fileName: "tree_stand.svg",
    realHeight: null,
    component: TreeStand,
    defaultWidth: 140,
    defaultHeight:  486.5,
};


export const all_non_targets = [tree_stand];