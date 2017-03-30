/**
 * Created by Leon on 17/3/29.
 */
var BaseCore = require('./BaseCore');
class NoAnchorRouter extends BaseCore {
    constructor(tagName = "rt-view") {
        super(tagName, false);
        let _self = this;
        this.oldHash = "";
        Object.defineProperty(this, "oldHash", {
            enumerable: true,
            configurable: true,
            set: (newValue) => {
                if (newValue != this.value) {
                    _self.$$refreshView(newValue, false, this.value || "");
                    this.value = newValue;
                }
            }
        });
    }

    $$when(key, configObj) {
        super.$$when(key,configObj);
        if (this.oldHash == key) {
            this.$$refreshView(key, true);
        }
    }
}
module.exports = NoAnchorRouter;