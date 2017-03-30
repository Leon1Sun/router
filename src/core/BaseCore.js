/**
 * Created by Leon on 17/3/27.
 */

const util = require("./../util/Util");
const RouteMap = require("./RouteMap");
const RouteConfig = require("./RouteConfig");

class RouterCore {
    constructor(tagName = "rt-view", isAnchor = true) {
        // remove single instance
        let _self = this;
        this.isAnchor = isAnchor;
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
        if (!this.routeMap.has("")) {
            this.routeMap.set("", new RouteConfig(this.rootEle.innerHTML, ''));
        }
    };

    $$refreshView(newHash, isInit,_oldHash) {
        newHash = newHash.replace("#!", '');
        let _self = this;
        if (this.routeMap.has(newHash)) {
            //更新template
            this.routeMap.getAsync(newHash).then((config) => {
                _self.rootEle.innerHTML = config.template;
                //锚点模式下，对Anchor有监听事件
                if (_self.isAnchor) {
                    _self.oldHash = newHash;
                }
                //非锚点模式下，对oldHash的setter有监听事件
                else {

                }
                _self.$$clearScript(newHash);
                _self.$$evalScript(newHash);
            }).then(() => {
                if (!isInit) {
                    //如果不是第一次加载，则通过新旧值检查
                    //旧模板html发生变化
                    if(!_oldHash && _self.oldHash){
                        _oldHash = _self.oldHash;
                    }
                    _self.routeMap.getAsync(_oldHash).then((config) => {
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
                let sEle = (window.document) ? null : window.document.getElementById("s_" +this.tagName + "+" + hash);
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
                newScript.id = "s_" +this.tagName + "+" + hash;
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

    }
}
module.exports = RouterCore;