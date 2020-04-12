import randomstring from "randomstring";

export default class  NonTargetObject {
    constructor(options) {
        this.id = randomstring.generate(7);
        this.x = options.x;
        this.y = options.y;
        this.width = options.width;
        this.height = options.height;
        this.fileName = options.fileName;
        this.type = options.type
    }
}