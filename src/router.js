'use strict';
window.Router = (() => {
    let RouterInstance = (() => {
        let instance;
        return (newInstance) => {
            if (newInstance) instance = newInstance;
            return instance;
        }
    })();
    let routers = new Map();
    class Router {
        constructor(tagName, isAnchor) {
            let RouterCore;
            /*use single instance
             * if isAnchor*/
            if (isAnchor) {
                if (RouterInstance()) return RouterInstance();
                /*get core*/
                RouterCore = require('./core/AnchorRouter');
            }
            else{
                if (routers.has(tagName)){
                    return routers.get(tagName)
                }
                /*get core*/
                RouterCore = require('./core/NoAnchorRouter')
            }


            let _r = new RouterCore(tagName, isAnchor);

            /**
             * _hash
             * 当前锚点名
             */
            this.$hash;//= _r.oldHash;
            Object.defineProperty(this, '$hash', {
                enumerable: true,
                configurable: true,
                get: ()=> {
                    return _r.oldHash;
                },
                set: (value)=> {
                    _r.oldHash = value;
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
                get: ()=> {
                    return _r.routeMap.keys;
                }
            });
            /**
             * 获得路由对应设置
             * @param key
             * @returns {*}
             */
            this.$getConfig = (key) => {
                return _r.routeMap.get(key)
            };

            /*return single instance*/
            if (isAnchor) {
                RouterInstance(this);
            }
            else{
                if(!routers.has(tagName)){
                    routers.set(tagName,this);
                }
            }
        }
    }

    return Router;
})();
