/**
 * Created by Leon on 17/3/27.
 */

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
        var index = this.keys.indexOf(key);
        if (index >= 0) {
            var config = this.configs[index];
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
module.exports = RouteMap;