
class ShotDetector {
    constructor(videoObj, h, s, v, hRadius, sRadius, vRadius, {
        targetCorners = [],
        outputDimensions = null,
        delayThreshold = 300,
        fps = 15,
        scoringZones = []
    }) {
        this.video = videoObj
        this.video.height = this.video.videoHeight;
        this.video.width = this.video.videoWidth;

        //this.outputCanvas = outputCanvas;
        this.fps = fps;
        this.delayThreshold = delayThreshold;
        this.lastShot = null;
        this.shotInLastFrame = false;
        this.currentlyProcessing = false;

        this.h = h
        this.s = s
        this.v = v
        this.hRadius = hRadius
        this.sRadius = sRadius
        this.vRadius = vRadius

        this.targetCorners = targetCorners

        if (outputDimensions == null) {
            this.outputDimensions = {
                rows: this.video.height,
                columns: this.video.width
            }
        } else {
            this.outputDimensions = outputDimensions
        }

        this.videoCapture = new window.cv.VideoCapture(this.video);

        this.scoringZones = scoringZones
        if (this.scoringZones.length === 0) {
            this.scoringZones.push({
                name: "default",
                x: 0,
                y: 0,
                width: this.outputDimensions.columns,
                height: this.outputDimensions.rows,
                lastShot: null,
                shotInLastFrame: false,
                roi: new window.cv.Rect(0, 0, this.outputDimensions.columns, this.outputDimensions.rows),
                mask: this.getMask(0, 0, this.outputDimensions.columns, this.outputDimensions.rows)
            })
        } else {
            for (let i in this.scoringZones) {
                let zone = this.scoringZones[i]
                this.scoringZones[i]["lastShot"] = null
                this.scoringZones[i]["shotInLastFrame"] = false
                this.scoringZones[i]["roi"] = new window.cv.Rect(this.scoringZones[i].x, this.scoringZones[i].y, this.scoringZones[i].width, this.scoringZones[i].height)
                this.scoringZones[i]["mask"] = this.getMask(zone.x, zone.y, zone.width, zone.height)
            }
        }
    }

    getMask(x, y, width, height, maxWidth, maxHeight) {
        maxWidth = Math.floor(this.outputDimensions.columns);
        maxHeight = Math.floor(this.outputDimensions.rows);
        height = Math.floor(height);
        width = Math.floor(width);
        let arr = []
        for (let i = 0; i < maxWidth * maxHeight; i++) {
            const row = Math.floor(i / maxWidth)
            const column  = i % maxWidth;
            if (column >= x && column <= x + width && row >= y && row <= y + height) {
                arr.push(1)
            } else {
                arr.push(0)
            }
        }
        return window.cv.matFromArray(maxHeight, maxWidth, window.cv.CV_8U, arr)
    }

    start(onHit) {
        // Pre-initialize all OpenCV objects so that they can be reused. Otherwise it will crash after
        // running for a little bit

        // Setup for processVideo
        this.readFrame = new window.cv.Mat(this.video.videoHeight, this.video.videoWidth, window.cv.CV_8UC4);
        this.warpedFrame = new window.cv.Mat(this.outputDimensions.rows, this.outputDimensions.columns, window.cv.CV_8UC4);

        const minThresholdValue = new window.cv.Scalar(Math.max(this.h - this.hRadius, 0),
                                                       Math.max(this.s - this.sRadius, 0),
                                                       Math.max(this.v - this.vRadius, 0));
        const maxThresholdValue = new window.cv.Scalar(Math.min(this.h + this.hRadius, 179),
                                                       Math.min(this.s + this.sRadius, 255),
                                                       Math.min(this.v + this.vRadius, 255));

        this.minThreshold = new window.cv.Mat(this.outputDimensions.rows, this.outputDimensions.columns, window.cv.CV_8UC3, minThresholdValue);
        this.maxThreshold = new window.cv.Mat(this.outputDimensions.rows, this.outputDimensions.columns, window.cv.CV_8UC3, maxThresholdValue);

        this.hsvImage = new window.cv.Mat();
        this.thresholdImage = new window.cv.Mat();
        this.maskedImage  = new window.cv.Mat();

        this.contours = new window.cv.MatVector();
        this.hierarchy = new window.cv.Mat();
        this.hMatrix = new window.cv.Mat();
        this.cropped = new window.cv.Mat();

        this.calculateHomography();

        // Begin processing
        const delay = 1000/this.fps
        this.running = true;
        this.interval = setInterval(() => {
            if (!this.running) {
                return;
            }
            let hits = this.processVideo();
            if (!!hits && hits.length > 0) {
                console.log("hits found")
                if (hits.length > 1)
                    console.log("Multiple hits at the same time oh baby")
                onHit(hits);
            }
        }, delay);
        //this.processVideo();
    }

    calculateHomography() {
        this.videoCapture.read(this.readFrame);
        let targetCornersArray = []

        for (let index in this.targetCorners) {
            const corner = this.targetCorners[index]
            targetCornersArray.push(corner.x);
            targetCornersArray.push(corner.y);
        }

        let videoCornersArray = [
            0, 0,
            this.outputDimensions.columns, 0,
            this.outputDimensions.columns, this.outputDimensions.rows,
            0, this.outputDimensions.rows
        ]

        let targetCorners = window.cv.matFromArray(4, 2, window.cv.CV_32SC1, targetCornersArray);

        let videoCorners = window.cv.matFromArray(4, 2,  window.cv.CV_32SC1, videoCornersArray);

        try {
            this.hMatrix = window.cv.findHomography(targetCorners, videoCorners);
        } catch (e) {
            console.log("ERROR FINDING HOMOGRAPHY");
            console.error(e)
        }
    }

    static shiftPerspective(canvas, hMatrix) {
        let frame =  window.cv.imread(canvas);
        window.cv.imshow()
        window.cv.warpPerspective(frame, frame, hMatrix, new window.cv.Size(canvas.width, canvas.height))
        window.cv.imshow(canvas, frame);
        frame.delete();
    }


    stop() {
        clearInterval(this.interval)
        this.running = false

        try {
            this.readFrame.delete();
            this.warpedFrame.delete();
            this.minThreshold.delete();
            this.maxThreshold.delete();
            this.hsvImage.delete();
            this.thresholdImage.delete();
            this.contours.delete();
            this.hierarchy.delete();
            //this.videoCapture.release();
            this.hMatrix.delete();
            this.cropped.delete();
        } catch (e) {
            console.log("ERROR")
            console.error(e)
        }
    }

    processVideo() {
        // Check if its already running - should only happen if FPS is to high and/or browser is too slow
        if (this.currentlyProcessing) {
            console.log("Already processing");
            return [];
        }
        let now = new Date()

        this.currentlyProcessing = true;
        try {
            this.videoCapture.read(this.readFrame)

            window.cv.warpPerspective(this.readFrame, this.warpedFrame, this.hMatrix, new window.cv.Size(this.outputDimensions.columns, this.outputDimensions.rows))

            window.cv.cvtColor(this.warpedFrame, this.hsvImage, window.cv.COLOR_BGR2HSV);
            window.cv.inRange(this.hsvImage, this.minThreshold, this.maxThreshold, this.thresholdImage)
            // window.cv.findContours(this.thresholdImage, this.contours, this.hierarchy, window.cv.RETR_CCOMP, window.cv.CHAIN_APPROX_SIMPLE);


            let hits = [];
            this.scoringZones.forEach((zone, index) => {
                if (zone.lastShot !== null && now - this.zone < this.delayThreshold) {
                    console.log("Within delay threshold")
                    return;
                }
                // this.cropped = this.thresholdImage.roi(zone.roi)
                //window.cv.bitwise_and(this.thresholdImage, this.thresholdImage, this.cropped, zone.mask)
                window.cv.bitwise_and(this.thresholdImage, zone.mask, this.cropped);
                window.cv.findContours(this.cropped, this.contours, this.hierarchy, window.cv.RETR_CCOMP, window.cv.CHAIN_APPROX_SIMPLE);
                //window.cv.findContours(this.thresholdImage, this.contours, this.hierarchy, window.cv.RETR_CCOMP, window.cv.CHAIN_APPROX_SIMPLE);


                if (this.contours.size() === 0) {
                    this.scoringZones[index].shotInLastFrame = false
                    return;
                }

                if (zone.shotInLastFrame) {
                    return;
                }
                this.scoringZones[index].shotInLastFrame = true

                let cnt = this.contours.get(0);

                let circle = window.cv.minEnclosingCircle(cnt);

                this.scoringZones[index].lastShot = new Date();

                let center = {
                    x: circle.center.x,// + zone.x,
                    y: circle.center.y //+ zone.y
                }

                const hit = {center: center, radius: circle.radius, timestamp: new Date(), zone: zone.name};
                hits.push(hit);
            });

            this.currentlyProcessing = false
            return hits;
        } catch (e) {
            console.log("ERROR")
            console.error(e)
            this.currentlyProcessing = false;
            return null;
        }
    }
}

export default ShotDetector;