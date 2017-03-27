/**
 * Created by Leon on 17/3/27.
 */

var getEmptyPromise = () => {
    return new Promise((resolve, reject) => {
        resolve();
    })
}
class RouteConfig {
    constructor(template = "", script = "", templateUrl = "", scriptUrl = "") {
        this.template = template || "";
        this.script = script || "";
        this.templateUrl = templateUrl;
        this.scriptUrl = scriptUrl;
    }

    async(fn) {
        return getEmptyPromise().then(() => {
            console.log(1);
            return 2;
        });
    }
}
var config = new RouteConfig(null, null, "template/template.html?v=1", "js/script.js");
config.async().then((e) => {
        console.log(e)
        console.log(2)

});