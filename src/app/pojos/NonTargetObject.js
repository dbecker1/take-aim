import randomstring from "randomstring";

export default class  NonTargetObject {
    constructor(options) {
        Object.assign(this, options); // using this because properties are different for each type of non target object
        this.id = randomstring.generate(7);
    }
}