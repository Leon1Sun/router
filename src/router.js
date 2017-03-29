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
        constructor(tagName, isAnchor) {
            /*use single instance
             * if isAnchor*/
            if (isAnchor) {
                if (RouterInstance()) return RouterInstance();
            }

            /*get core*/
            let RouterCore = require('./core/Core.js');
            this._r = new RouterCore(tagName, isAnchor);

            /**
             * _hash
             * 当前锚点名
             */
            this.$hash;//= this._r.oldHash;
            var _self = this;
            Object.defineProperty(this, '$hash', {
                enumerable: true,
                configurable: true,
                get: function reactiveGetter() {
                    return _self._r.oldHash;
                },
                set: function (value) {
                    _self._r.oldHash = value;
                }
            });
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
                return this._r.$$when(key, routeConfig);
            };
            /**
             * 已经设置的路由列表
             * @type {Array}
             */
            this.$list = this._r.routeMap.keys;
            Object.defineProperty(this, '$list', {
                enumerable: true,
                configurable: true,
                get: function reactiveSetter(newVal) {
                    return this._r.routeMap.keys;
                }
            });
            /**
             * 获得路由对应设置
             * @param key
             * @returns {*}
             */
            this.$getConfig = (key) => {
                let index = this._r.routeMap.keys.indexOf(key);
                if (index < 0) {
                    return
                }
                else {
                    return this._r.routeMap.configs[index];
                }
            };

            /*return single instance*/
            if (isAnchor) {
                RouterInstance(this);
            }
        }
    }

    return Router;
})();
