/**
 * Created by Leon on 17/3/27.
 */

const util = require("./../util/Util");
const RouteMap = require("./RouteMap");
const RouteConfig = require("./RouteConfig");
let CoreInstance = (() => {
    let instance;
    return (newInstance) => {
        if (newInstance) instance = newInstance;
        return instance;
    }
})();
class RouterCore {
    constructor(tagName = "rt-view") {
        //single instance
        if (CoreInstance()) return CoreInstance();
        //end
        let _self = this;
        //get body elements
        if (typeof(window.document) != "undefined") {
            this.body = window.document.getElementsByTagName("BODY")[0];
        }
        else {
            this.body = {};
        }

        //view tag name
        this.tagName = tagName;

        this.rootEle = util.getXPath(tagName);
        this.scriptManager = {};

        this.routeMap = new RouteMap();
        if (!this.routeMap.contains("")) {
            this.routeMap.set("", new RouteConfig(this.rootEle.innerHTML, ''));
        }
        this.oldHash = window.location.hash.replace("#!", '');

        //add event listener
        (() => {
            window.onhashchange = (e) => {
                this.$$refreshView(window.location.hash);
            };
            console.debug("bind tag : " + tagName + " success")
        })();

        //init
        this.$$refreshView(window.location.hash, true);
        //init single instance
        CoreInstance(this);
    };

    $$refreshView(newHash, isInit) {
        newHash = newHash.replace("#!", '');
        let _self = this;
        if (this.routeMap.contains(newHash)) {
            //更新template
            this.routeMap.getAsync(newHash).then((config) => {
                _self.rootEle.innerHTML = config.template;
                _self.oldHash = newHash;
                _self.$$clearScript(newHash);
                _self.$$evalScript(newHash);
            }).then(() => {
                if (!isInit) {
                    //如果不是第一次加载，则通过新旧值检查
                    //旧模板html发生变化
                    _self.routeMap.getAsync(_self.oldHash).then((config) => {
                        config.template = _self.rootEle.innerHTML
                    });
                }
            });

        }
        else {
            return;
        }
    };

    $$clearScript(hash) {
        for (let scriptStr in this.scriptManager) {
            if (scriptStr != hash) {
                let sEle = (window.document) ? null : window.document.getElementById('s_' + scriptStr);
                if (sEle) {
                    this.body.removeChild(sEle);
                }
            }
        }
    }

    $$evalScript(hash) {
        try {
            let _self = this;
            this.routeMap.getAsync(hash).then((routerConfig) => {
                let script = routerConfig.script || '';
                //用eval会让一些注册事件一直存在
                // eval('(' + script + ')');
                let newScript = window.document.createElement('script');
                newScript.id = "s_" + hash;
                newScript.type = 'text/javascript';
                newScript.innerHTML = script;
                _self.body.appendChild(newScript);
                _self.scriptManager[hash] = script;
            });

        }
        catch (e) {
            throw (e);
        }
    };

    $$when(key, configObj) {
        let routeConfig = new RouteConfig(configObj.template, configObj.script, configObj.templateUrl, configObj.scriptUrl);
        this.routeMap.set(key, routeConfig);
        if (window.location.hash == ('#!' + key)) {
            this.$$refreshView(window.location.hash, true);
        }

    }
}
module.exports = RouterCore;