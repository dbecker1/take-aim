
class ShotDetector {
    constructor(videoObj, h, s, v, hRadius, sRadius, vRadius, targetCorners = [], outputCanvas = null, showHits = true, delayThreshold = 500, fps = 30) {
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

        this.targetCorners = targetCorners;
        this.outputCanvas = outputCanvas;
        this.showHits = showHits;

        this.videoCapture = new window.cv.VideoCapture(this.video);
    }

    start(onHit) {
        // Pre-initialize all OpenCV objects so that they can be reused. Otherwise it will crash after
        // running for a little bit

        // Setup for processVideo
        this.readFrame = new window.cv.Mat(this.video.videoHeight, this.video.videoWidth, window.cv.CV_8UC4);

        //const minThresholdValue = new window.cv.Scalar(20, 100, 200);
        //const maxThresholdValue = new window.cv.Scalar(160, 255, 256);

        const minThresholdValue = new window.cv.Scalar(Math.max(this.h - this.hRadius, 0),
                                                       Math.max(this.s - this.sRadius, 0),
                                                       Math.max(this.v - this.vRadius, 0));
        const maxThresholdValue = new window.cv.Scalar(Math.min(this.h + this.hRadius, 179),
                                                       Math.min(this.s + this.sRadius, 255),
                                                       Math.min(this.v + this.vRadius, 255));

        this.minThreshold = new window.cv.Mat(this.video.videoHeight, this.video.videoWidth, window.cv.CV_8UC3, minThresholdValue);
        this.maxThreshold = new window.cv.Mat(this.video.videoHeight, this.video.videoWidth, window.cv.CV_8UC3, maxThresholdValue);

        this.hsvImage = new window.cv.Mat();
        this.thresholdImage = new window.cv.Mat();

        this.contours = new window.cv.MatVector();
        this.hierarchy = new window.cv.Mat();
        this.H = new window.cv.Mat();

        this.temp = new window.cv.Mat(this.video.videoHeight, this.video.videoWidth, window.cv.CV_8UC4);

        this.calculateHomography();

        // Begin processing
        const delay = 1000/this.fps
        this.interval = setInterval(() => {
            let hit = this.processVideo();
            if (hit != null) {
                console.log("hit found")
                onHit(hit);
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
            this.video.videoWidth, 0,
            this.video.videoWidth, this.video.videoHeight,
            0, this.video.videoHeight
        ]

        let targetCorners = window.cv.matFromArray(4, 2, window.cv.CV_32SC1, targetCornersArray);

        let videoCorners = window.cv.matFromArray(4, 2,  window.cv.CV_32SC1, videoCornersArray);

        try {
            this.H = window.cv.findHomography(targetCorners, videoCorners);
            //this.H = window.cv.getPerspectiveTransform(targetCorners, videoCorners)
            console.log(this.H);

            window.cv.warpPerspective(this.readFrame, this.temp, this.H, new window.cv.Size(this.video.videoWidth, this.video.videoHeight))

            window.cv.imshow(this.outputCanvas, this.temp)
        } catch (e) {
            console.log("ERROR FINDING HOMOGRAPHY");
            console.error(e)
        }
    }

    stop() {
        clearInterval(this.interval)

        this.readFrame.delete();
        this.minThreshold.delete();
        this.maxThreshold.delete();
        this.hsvImage.delete();
        this.thresholdImage.delete();
        this.contours.delete();
        this.hierarchy.delete();
        this.videoCapture.release();
    }

    processVideo() {
        // Check if its already running - should only happen if FPS is to high and/or browser is too slow
        if (this.currentlyProcessing) {
            console.log("Already processing");
            return;
        }
        let now = new Date()
        if (this.lastShot !== null && now - this.lastShot < this.delayThreshold) {
            console.log("Within delay threshold")
            return;
        }
        this.currentlyProcessing = true;
        try {
            this.videoCapture.read(this.readFrame)

            window.cv.cvtColor(this.readFrame, this.hsvImage, window.cv.COLOR_BGR2HSV);
            window.cv.inRange(this.hsvImage, this.minThreshold, this.maxThreshold, this.thresholdImage)
            window.cv.findContours(this.thresholdImage, this.contours, this.hierarchy, window.cv.RETR_CCOMP, window.cv.CHAIN_APPROX_SIMPLE);

            if (this.contours.size() === 0) {
                //console.log("No shot")
                this.shotInLastFrame = false;
                this.currentlyProcessing = false;
                return null;
            }

            if (this.shotInLastFrame) {
                //console.log("Shot in last frame")
                this.currentlyProcessing = false;
                return null;
            }
            this.shotInLastFrame = true;
            let cnt = this.contours.get(0);

            let circle = window.cv.minEnclosingCircle(cnt);
            if (circle.radius < 1 || circle.radius > 20) {
                if (circle.radius < 2) {
                    console.log("Radius too small!")
                }
                else {
                    console.log("Radius too big!")
                }
                this.shotInLastFrame = false;
                this.currentlyProcessing = false;
                return null;
            }
            this.lastShot = new Date();

            this.currentlyProcessing = false;
            return circle.center;
        } catch (e) {
            console.log("ERROR")
            console.error(e)
            this.currentlyProcessing = false;
            return null;
        }
    }
}

export default ShotDetector;