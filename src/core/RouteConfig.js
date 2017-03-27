/**
 * Created by Leon on 17/3/27.
 */
var util = require("./../util/Util");
class RouteConfig {
    constructor(template = "", script = "", templateUrl = "", scriptUrl = "") {
        this.template = template || "";
        this.script = script || "";
        this.templateUrl = templateUrl;
        this.scriptUrl = scriptUrl;
    }

    async() {
        //根据所缺少的资源进行请求，并且执行一次then
        //返回的promise再执行then时，入参为key对应configObj
        let _self = this;
        if (this.template == "" && this.templateUrl != "" && this.script != "") {
            return util.getResourcePromise(this.templateUrl).then((res) => {
                _self.template = res;
                return _self
            })
        }


        else if (this.script == "" && this.scriptUrl != "" && this.template != "") {
            return util.getResourcePromise(this.scriptUrl).then((res) => {
                _self.script = res;
                return _self
            })
        }
        else if (this.script == "" && this.scriptUrl != "" && this.template == "" && this.templateUrl != "") {
            return Promise.all([util.getResourcePromise(this.templateUrl), util.getResourcePromise(this.scriptUrl)]).then(
                (result) => {
                    console.log(self);
                    _self.template = result[0];
                    _self.script = result[1];
                    console.log(_self);
                    return _self;
                }
            );
        }
        else {
            return util.getEmptyPromise().then(() => {
                return _self;
            });
        }
    }
}
module.exports = RouteConfig;