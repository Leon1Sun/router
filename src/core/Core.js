/**
 * Created by Leon on 17/3/27.
 */

const util = require("./../util/WindowUtil");
const RouteMap = require("./RouteMap").RouteMap;
const RouteConfig = require("./RouteMap").RouteConfig;
let CoreInstance =  (()=> {
    let instance;
    return (newInstance) => {
        if (newInstance) instance = newInstance;
        return instance;
    }
})();
class RouterCore {
    constructor(tagName) {
        //single instance
        if (CoreInstance()) return CoreInstance();
        //end

        //get body elements
        if(typeof(document)!="undefined"){
            this.body = document.getElementsByTagName("BODY")[0];
        }
        else{
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
        this.oldHash = location.hash.replace("#", '');

        //add event listener
        (() => {
            window.onhashchange = (e) => {
                this.$$refreshView(location.hash);
            };
            console.debug("bind success")
        })();

        //init
        this.$$refreshView(location.hash,true);
        //init single instance
        CoreInstance(this);
    };

    $$refreshView(newHash, isInit) {
        newHash = newHash.replace("#", '');
        let _self = this;
        if (this.routeMap.contains(newHash)) {
            //更新template
             this.routeMap.getAsync(newHash,(config)=>{
                 _self.rootEle.innerHTML = config.template;
                 _self.oldHash = newHash;

                 _self.$$clearScript(newHash);
                 _self.$$evalScript(newHash);
                 if (!isInit) {
                     //如果不是第一次加载，则通过新旧值检查
                     //旧模板html发生变化
                     _self.routeMap.getAsync(_self.oldHash,(oldConfig)=>{
                         oldConfig.template = _self.rootEle.innerHTML
                     });
                 }
             });

        }
        else {
            return;
        }
    };

    $$clearScript(anchor) {
        for (let a in this.scriptManager) {
            if (a != anchor) {
                let sEle = (document)?null:document.getElementById('s_' + a);
                if (sEle) {
                    this.body.removeChild(sEle);
                }
            }
        }
    }

    $$evalScript(anchor) {
        try {
            let _self = this;
            this.routeMap.getAsync(anchor,(routerConfig)=>{
                let script = routerConfig.script || '';
                //用eval会让一些注册事件一直存在
                // eval('(' + script + ')');
                let newScript = document.createElement('script');
                newScript.id = "s_" + anchor;
                newScript.type = 'text/javascript';
                newScript.innerHTML = script;
                _self.body.appendChild(newScript);
                _self.scriptManager[anchor] = script;
            });

        }
        catch (e) {
            throw (e);
        }
    };

    $$when(key, configObj) {
        let routeConfig = new RouteConfig(configObj.template,configObj.script,configObj.templateUrl,configObj.scriptUrl);
        this.routeMap.set(key, routeConfig);
        if (location.hash == ('#'+key)) {
            this.$$refreshView(location.hash, true);
        }

    }
}
module.exports = RouterCore;