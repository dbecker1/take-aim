
class ShotDetector {
    constructor(videoObj, fps = 30, outputCanvas = null) {
        this.video = videoObj
        this.video.height = this.video.videoHeight;
        this.video.width = this.video.videoWidth;

        this.outputCanvas = outputCanvas
        this.fps = fps

        this.videoCapture = new window.cv.VideoCapture(this.video);
    }

    start() {
        // Pre-initialize all OpenCV objects so that they can be reused. Otherwise it will crash after
        // running for a little bit

        // Setup for processVideo
        this.readFrame = new window.cv.Mat(this.video.videoHeight, this.video.videoWidth, window.cv.CV_8UC4);

        const minThresholdValue = new window.cv.Scalar(20, 100, 200);
        const maxThresholdValue = new window.cv.Scalar(160, 255, 256);

        this.minThreshold = new window.cv.Mat(this.video.videoHeight, this.video.videoWidth, window.cv.CV_8UC3, minThresholdValue);
        this.maxThreshold = new window.cv.Mat(this.video.videoHeight, this.video.videoWidth, window.cv.CV_8UC3, maxThresholdValue);

        this.hsvImage = new window.cv.Mat();
        this.thresholdImage = new window.cv.Mat();

        this.currentlyProcessing = false;

        // Setup for detectCircles

        this.outputImage = window.cv.Mat.zeros(this.video.videoHeight, this.video.videoWidth, window.cv.CV_8UC3);
        this.contours = new window.cv.MatVector();
        this.hierarchy = new window.cv.Mat();

        // Begin processing

        const delay = 1000/this.fps
        setInterval(() => {this.processVideo()}, delay);
        //this.processVideo();
    }

    processVideo() {
        // Check if its already running - should only happen if FPS is to high and/or browser is too slow
        if (this.currentlyProcessing) {
            console.log("Already processing");
            return;
        }
        this.currentlyProcessing = true;
        try {
            this.videoCapture.read(this.readFrame)


            window.cv.cvtColor(this.readFrame, this.hsvImage, window.cv.COLOR_BGR2HSV);
            window.cv.inRange(this.hsvImage, this.minThreshold, this.maxThreshold, this.thresholdImage)


            // if (this.outputCanvas !== null) {
            //     window.cv.imshow(this.canvasRef.current, this.minThreshold)
            // }

            this.detectCircles(this.thresholdImage);

        } catch (e) {
            console.log("ERROR")
            console.error(e)
        }

        this.currentlyProcessing = false;
    }

    detectCircles(image) {

        let dst = window.cv.Mat.zeros(image.rows, image.cols, window.cv.CV_8UC3);

        window.cv.findContours(image, this.contours, this.hierarchy, window.cv.RETR_CCOMP, window.cv.CHAIN_APPROX_SIMPLE);

        if (this.contours.size() === 0) {
            console.log("No shot")
            return;
        }
        let cnt = this.contours.get(0);
        console.log(cnt)

        let circle = window.cv.minEnclosingCircle(cnt);
        let contoursColor = new window.cv.Scalar(255, 255, 255);
        let circleColor = new window.cv.Scalar(255, 0, 0);

        //window.cv.drawContours(dst, this.contours, 0, contoursColor, 1, 8, this.hierarchy, 100);
        window.cv.circle(dst, circle.center, 5, circleColor);

        if (this.outputCanvas !== null) {
            window.cv.imshow(this.outputCanvas, dst);
        }
    }
}

export default ShotDetector;