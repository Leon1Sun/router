/**
 * Created by Leon on 17/3/27.
 */
var util = require("./../util/Util");
class RouteConfig {
    constructor(template="", script="",templateUrl="",scriptUrl="") {
        this.template = template || "";
        this.script = script || "";
        this.templateUrl = templateUrl;
        this.scriptUrl = scriptUrl;
    }
    async(fn){
        console.log("async get res 1");
        let _self = this;
        if(this.template == "" && this.templateUrl != "" && this.script != ""){
            return util.getResourcePromise(this.templateUrl).then( (res)=> {
                _self.template = res;
                fn(_self);
            })
        }


        else if(this.script == "" && this.scriptUrl != "" && this.template != ""){
            return util.getResourcePromise(this.scriptUrl).then( (res)=> {
                _self.script = res;
                fn(_self);
            })
        }
        else if(this.script == "" && this.scriptUrl != "" && this.template == "" && this.templateUrl != ""){
            return Promise.all([util.getResourcePromise(this.templateUrl), util.getResourcePromise(this.scriptUrl)]).then(
                 (result) =>{
                    console.log(self);
                    _self.template = result[0];
                    _self.script = result[1];
                    fn(_self);
                }
            );
        }
        else{
            return util.getEmptyPromise().then(()=>{
                fn(_self);
            });
        }
    }
}
class RouteMap {
    constructor() {
        this.keys = [];
        this.configs = [];
    };

    getAsync(key,fn) {
        var index = this.keys.indexOf(key);
        if (index >= 0) {
            var config = this.configs[index];
            // if(config.template != "" && config.script != ""){
            //     fn(config);
            //     return;
            // }
            config.async(
                ()=>{
                    console.log("async res success");
                    console.log(config);
                    fn(config);
                    return;
                }
            );

        }
        else {
            return undefined
        }
    };

    set(key, config) {
        if (!config instanceof RouteConfig) {
            console.warn("config is not instanceof RouteConfig");
            return false;
        }
        var index = this.keys.indexOf(key);
        if (index > 0) {
            this.configs[index] = config;
        }
        else {
            this.keys.push(key);
            this.configs.push(config);
        }
    };

    contains(key) {
        return this.keys.indexOf(key) >= 0;
    }
}
module.exports.RouteMap = RouteMap;
module.exports.RouteConfig = RouteConfig;