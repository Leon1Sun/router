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
            /*single instance*/
            if (RouterInstance()) return RouterInstance();

            /*get core*/
            let RouterCore = require('./core/Core.js');
            let _r = new RouterCore(tagName);

            /**
             * _hash
             * 当前锚点名
             */
            this.$hash = "";
            Object.defineProperty(this, '$hash', {
                enumerable: true,
                configurable: true,
                get: function reactiveGetter() {
                    return _r.oldHash;
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
                return _r.$$when(key, routeConfig);
            };
            /**
             * 已经设置的路由列表
             * @type {Array}
             */
            this.$list = _r.routeMap.keys;
            Object.defineProperty(this, '$list', {
                enumerable: true,
                configurable: true,
                get: function reactiveSetter(newVal) {
                    return _r.routeMap.keys;
                }
            });
            /**
             * 获得路由对应设置
             * @param key
             * @returns {*}
             */
            this.$getConfig = (key)=>{
                let index = _r.routeMap.keys.indexOf(key);
                if(index <0){
                    return
                }
                else{
                    return _r.routeMap.configs[index];
                }
            };

            /*single instance*/
            RouterInstance(this);
        }
    }

    return Router;
})();
