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

            /**
             * _hash
             * 当前锚点名
             */
            this._hash = _r.tagName;
            /**
             * 设置锚点名，与对应路由关系
             * @param key 锚点名
             * @param routeConfig 路由配置
             * 示例
             * {
             *  template:"<div id='v2'><span>view2</span></div>",
             *  script:"document.getElementById('v2').innerHTML = 'change'"
             * }
             * 或
             * {
             *  templateUrl:"template/template.html?v=1",
             *  scriptUrl:"js/script.js"
             *  }
             *
             * @returns {*}
             */
            this.$when = (key, routeConfig) => {
                return _r.$$when(key, routeConfig);
            };
            RouterInstance(this);
        }
    }

    return Router;
})();
