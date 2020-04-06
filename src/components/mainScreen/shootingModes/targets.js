//In order to create scoring zones, take your SVG image and view the raw xml of it. Each zone should be defined by a
//single <path> tag. Take the "d" attribute of this tag (the one that defines the path) and put the resultant string
// in for the "path" of the scoringZone
export let basic_silhouette = {
    name: "basic_silhouette",
    fileName: "basic_silhouette.svg",
    displayName: "Basic Silhouette Target",
    realHeight: 36,
    scoringZones: [
        {
            name: "Bullseye",
            pointValue: 10,
            path: "M119.72,224.91v15.34a8.57,8.57,0,0,1-.11,1.44,11.06,11.06,0,0,1-21.78,0,8.57,8.57,0,0,1-.11-1.44V224.91c0-.16,0-.32,0-.48a11,11,0,0,1,22,0C119.72,224.59,119.72,224.75,119.72,224.91Z",
            priority: 1
        },
        {
            name: "9",
            pointValue: 9,
            path: "M128.72,218.68v28.76c0,.32,0,.65,0,1-.52,10.15-9.26,18.22-20,18.22s-19.45-8.07-20-18.22c0-.31,0-.64,0-1V218.68c0-10.6,9-19.18,20-19.18S128.72,208.08,128.72,218.68Z",
            priority: 2
        },
        {
            name: "8",
            pointValue: 8,
            path: "M148.22,207.17V259c0,21.18-17.91,38.35-40,38.35s-40-17.17-40-38.35V207.17c0-21.18,17.91-38.35,40-38.35S148.22,186,148.22,207.17Z",
            priority: 3
        },
        {
            name: "7",
            pointValue: 7,
            path: "M168.72,194.71v76.7c0,31.78-26.86,57.53-60,57.53s-60-25.75-60-57.53v-76.7c0-31.78,26.86-57.53,60-57.53S168.72,162.93,168.72,194.71Z",
            priority: 4
        },
        {
            name: "6",
            pointValue: 6,
            path: "M187.72,180.33V284.84c0,41.83-35.37,75.74-79,75.74s-79-33.91-79-75.74V180.33c0-41.84,35.37-75.75,79-75.75S187.72,138.49,187.72,180.33Z",
            priority: 5
        }
    ]
};

export let uspsa = {
    name: "uspsa_standard",
    fileName: "uspsa.svg",
    displayName: "USPSA Standard Target",
    realHeight: 36,
    scoringZones: [
        {
            name: "A - Head",
            pointValue: 5,
            path: "M138.52,43.25H99.68a6.38,6.38,0,0,1-6.38-6.38V22.76a6.38,6.38,0,0,1,6.38-6.38h38.84a6.37,6.37,0,0,1,6.38,6.38V36.87A6.38,6.38,0,0,1,138.52,43.25Z",
            priority: 1
        },
        {
            name: "A - Body",
            pointValue: 5,
            path: "M148.75,246.43H89.46a6.37,6.37,0,0,1-6.37-6.37V116.27a6.37,6.37,0,0,1,6.37-6.37h59.29a6.37,6.37,0,0,1,6.37,6.37V240.06A6.38,6.38,0,0,1,148.75,246.43Z",
            priority: 1
        },
        {
            name: "B",
            pointValue: 4,
            path: "M160.43,73.35H75.5V.25h84.93Z",
            priority: 2
        },
        {
            name: "C",
            pointValue: 3,
            path: "M68.74,300.71,43.79,242.87l1.35-138.19-.22-4.56L63.8,77.62l3.59-4.27h99.8L172.12,78,191,100.52l-.21,4.56,1.35,138.19-1.54,3.57-22.74,53.87H68.74Z",
            priority: 2
        },
        {
            name: "D",
            pointValue: 2,
            path: "M40,377.57.25,300.17,2.4,115.27l-.34-6.1,30.1-30.1,5.72-5.72H197l7.86,6.25,30.1,30.1-.34,6.11,2.15,184.9-2.45,4.78-36.25,72.08H40Z",
            priority: 3
        }
    ]
};

export const all_targets = [basic_silhouette, uspsa];