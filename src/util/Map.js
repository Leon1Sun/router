/**
 * Created by Leon on 17/3/29.
 */
const RouteConfig = require("./RouteConfig");
class RouteMap {
    constructor() {
        this.keys = [];
        this.configs = [];
    };

    /**
     * 异步获取config
     * 因为部分资源可能异步加载
     * @param key
     * @returns {*}
     */
    getAsync(key) {
        let index = this.keys.indexOf(key);
        if (index >= 0) {
            let config = this.configs[index];
            return config.async();
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
        let index = this.keys.indexOf(key);
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
    size(){
        return this.keys.length;
    }
}
module.exports = RouteMap;