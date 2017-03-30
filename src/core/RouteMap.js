/**
 * Created by Leon on 17/3/27.
 */
const RouteConfig = require("./RouteConfig");
class RouteMap {
    constructor() {
        let map = new Map();
        /**
         * 异步获取config
         * 因为部分资源可能异步加载
         * @param key
         * @returns {*}
         */
        this.getAsync = (key) => {
            let config = map.get(key);
            if (config) {
                return config.async();
            }
            else {
                return
            }
        };
        this.get = (key) => {
            return map.get(key);
        }
        this.set = (key, config) => {
            if (!config instanceof RouteConfig) {
                console.warn("config is not instanceof RouteConfig");
                return false;
            }
            map.set(key, config);
        };
        this.has = (key) => {
            return map.has(key);
        }
    };


}
module.exports = RouteMap;