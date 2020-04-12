

class WebcamCalibrator {
    constructor(video,  outputCanvas, existingCorners = null, fps = 15) {
        this.video = video
        this.video.width = this.video.videoWidth;
        this.video.height = this.video.videoHeight
        this.outputCanvas = outputCanvas

        this.videoCapture = new window.cv.VideoCapture(this.video);

        this.fps = fps;

        if (!!existingCorners) {
            this.corners = existingCorners;
            this.currentCorner = 5;
        } else {
            this.corners = [{}, {}, {}, {}];
            this.currentCorner = 0;
        }
    }

    start() {
        this.readFrame = new window.cv.Mat(this.video.videoHeight, this.video.videoWidth, window.cv.CV_8UC4);

        if (!!this.interval) {
            clearInterval(this.interval)
        }
        this.size = new window.cv.Size(9, 6)

        const delay = 1000/this.fps
        this.interval = setInterval(() => {this.redrawCanvas()}, delay)

        this.outputCanvas.addEventListener("mousedown", (e) => {
            this.registerClick(e);
        })

    }

    nextCorner() {
        this.currentCorner = this.currentCorner + 1;
    }

    getCorners() {
        return this.corners;
    }

    reset() {
        this.corners = [{}, {}, {}, {}]
        this.currentCorner = 0;
        this.nextCorner()
    }

    registerClick(e) {
        let rect = this.outputCanvas.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        this.corners[this.currentCorner - 1] = {
            x: x,
            y: y
        }
    }

    release() {
        try {
            clearInterval(this.interval)
            this.readFrame.delete();
            this.videoCapture.release();
        } catch (e) {
            console.log("Error during release of WebcamCalibrator")
        }
    }


    redrawCanvas() {
        try {
            this.videoCapture.read(this.readFrame)

            window.cv.imshow(this.outputCanvas, this.readFrame);

            var ctx = this.outputCanvas.getContext("2d");
            for (var index in this.corners) {
                let corner = this.corners[index];
                ctx.beginPath();
                ctx.fillStyle = "red"
                ctx.arc(corner.x, corner.y, 2, 0, 2*Math.PI, false)
                ctx.fill()
            }
        } catch(e) {
            console.log("ERROR")
            console.error(e)
        }
    }
}

export default WebcamCalibrator