

class LaserCalibrator {
    constructor(video,  outputCanvas, fps = 15) {
        this.video = video
        this.video.width = this.video.videoWidth;
        this.video.height = this.video.videoHeight
        this.outputCanvas = outputCanvas

        this.videoCapture = new window.cv.VideoCapture(this.video);

        this.fps = fps;
    }

    init() {
        this.readFrame = new window.cv.Mat(this.video.videoHeight, this.video.videoWidth, window.cv.CV_8UC4);
    }

    release() {
        this.readFrame.delete();
        this.videoCapture.release();

        if (!!this.minThreshold) {
            this.minThreshold.delete();
        }

        if (!!this.maxThreshold) {
            this.maxThreshold.delete();
        }

        if (!!this.hsvImage) {
            this.hsvImage.delete();
        }

        if (!!this.thresholdImage) {
            this.thresholdImage.delete();
        }

        if (!!this.interval) {
            clearInterval(this.interval);
        }
    }

    tryLaserCalibration(h, s, v, hRadius, sRadius, vRadius) {

        const minThresholdValue = new window.cv.Scalar(Math.max(h - hRadius, 0), Math.max(s - sRadius, 0), Math.max(v - vRadius, 0));
        const maxThresholdValue = new window.cv.Scalar(Math.min(h + hRadius, 179), Math.min(s + sRadius, 255), Math.min(v + vRadius, 255));

        if (!!this.minThreshold) {
            this.minThreshold.delete()
        }

        if (!!this.maxThreshold) {
            this.maxThreshold.delete();
        }

        this.minThreshold = new window.cv.Mat(this.video.videoHeight, this.video.videoWidth, window.cv.CV_8UC3, minThresholdValue);
        this.maxThreshold = new window.cv.Mat(this.video.videoHeight, this.video.videoWidth, window.cv.CV_8UC3, maxThresholdValue);

        if (!this.hsvImage) {
            this.hsvImage = new window.cv.Mat();
        }

        if (!this.thresholdImage) {
            this.thresholdImage = new window.cv.Mat();
        }

        const delay = 1000/this.fps;

        if (!!this.interval) {
            clearInterval(this.interval)
        }
        this.interval = setInterval(() => {this.showThreshold()}, delay)
    }

    showThreshold() {
        try {
            this.videoCapture.read(this.readFrame)

            window.cv.cvtColor(this.readFrame, this.hsvImage, window.cv.COLOR_BGR2HSV);
            window.cv.inRange(this.hsvImage, this.minThreshold, this.maxThreshold, this.thresholdImage)

            window.cv.imshow(this.outputCanvas, this.thresholdImage)
        } catch (e) {
            console.log("ERROR")
            console.error(e)
        }
    }
}

export default LaserCalibrator