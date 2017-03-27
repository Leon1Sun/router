'use strict';
window.Router = (() => {
    let RouterInstance = (() => {
        let instance;
        return (newInstance) => {
            if (newInstance) instance = newInstance;
            return instance;
        }
    })();
    class Router {
        constructor(tagName) {
            if (RouterInstance()) return RouterInstance();
            let RouterCore = require('./core/Core.js');
            let _r = new RouterCore(tagName);

            this.$when = (key, routeConfig) => {
                return _r.$$when(key, routeConfig);
            };
            this.$hash = _r.tagName;
            RouterInstance(this);
        }
    }

    return Router;
})();
