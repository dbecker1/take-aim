//In order to create scoring zones, take your SVG image and view the raw xml of it. Each zone should be defined by a
//single <path> tag. Take the "d" attribute of this tag (the one that defines the path) and change the capital "M"
//at the beginning to a lowercase "m". Put the resultant string in for the "path" of the scoringZone
export const basic_silhouette = {
    name: "basic_silhouette",
    fileName: "basic_silhouette.svg",
    displayName: "Basic Silhouette Target",
    realHeight: 36,
    scoringZones: [
        {
            name: "Bullseye",
            pointValue: 10,
            path: "m119.72,224.91v15.34a8.57,8.57,0,0,1-.11,1.44,11.06,11.06,0,0,1-21.78,0,8.57,8.57,0,0,1-.11-1.44V224.91c0-.16,0-.32,0-.48a11,11,0,0,1,22,0C119.72,224.59,119.72,224.75,119.72,224.91Z",
            priority: 1
        },
        {
            name: "9",
            pointValue: 9,
            path: "m128.72,218.68v28.76c0,.32,0,.65,0,1-.52,10.15-9.26,18.22-20,18.22s-19.45-8.07-20-18.22c0-.31,0-.64,0-1V218.68c0-10.6,9-19.18,20-19.18S128.72,208.08,128.72,218.68Z",
            priority: 2
        },
        {
            name: "8",
            pointValue: 8,
            path: "m148.22,207.17V259c0,21.18-17.91,38.35-40,38.35s-40-17.17-40-38.35V207.17c0-21.18,17.91-38.35,40-38.35S148.22,186,148.22,207.17Z",
            priority: 3
        },
        {
            name: "7",
            pointValue: 7,
            path: "M168.72,194.71v76.7c0,31.78-26.86,57.53-60,57.53s-60-25.75-60-57.53v-76.7c0-31.78,26.86-57.53,60-57.53S168.72,162.93,168.72,194.71Z"
        }
    ]
};

export const uspsa = {
    name: "uspsa_standard",
    fileName: "uspsa.svg",
    displayName: "USPSA Standard Target",
    realHeight: 36
};

export const all_targets = [basic_silhouette, uspsa];