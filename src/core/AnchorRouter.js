/**
 * Created by Leon on 17/3/29.
 */
var BaseCore = require('./BaseCore');
let CoreInstance = (() => {
    let instance;
    return (newInstance) => {
        if (newInstance) instance = newInstance;
        return instance;
    }
})();
class AnchorRouter extends BaseCore {
    constructor(tagName = "rt-view") {
        if (CoreInstance()) return CoreInstance();
        super(tagName, true);
        this.oldHash = window.location.hash.replace("#!", '');
        //add event listener
        (() => {
            window.onhashchange = (e) => {
                this.$$refreshView(window.location.hash);
            };
            console.debug("bind tag : " + tagName + " success")
        })();

        //init
        this.$$refreshView(window.location.hash, true);
        CoreInstance(this);
    }

    $$when(key, configObj) {
        super.$$when(key,configObj);
        if (window.location.hash == ('#!' + key)) {
            this.$$refreshView(window.location.hash, true);
        }
    }
}
module.exports = AnchorRouter;