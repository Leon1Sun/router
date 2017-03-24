'use strict';

window.Router = (function () {
    class RouteConfig {
        constructor(template, script) {
            this.template = template || "";
            this.script = script || "";
        }
    }
    class RouterMap {
        constructor() {
            this.keys = [];
            this.configs = [];
        };

        get(key) {
            var index = this.keys.indexOf(key);
            if (index >= 0) {
                return this.configs[index];
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
    class RouterCore {
        constructor(tagName) {
            var getViewRoot = (tagName = "rt-view") => {
                var xPath, rootEle;
                if (document.evaluate) {
                    xPath = document.evaluate('//*[@' + tagName + ']', document);
                    rootEle = xPath.iterateNext();
                    if (!rootEle) {
                        throw ("can't find rt-view");
                    }
                    else {
                        return rootEle;
                    }
                }
                else if (document.selectNodes) {
                    xPath = document.selectNodes("//*[@rt-view]");
                    if (!xPath || !xPath.length || xPath.length <= 0) {
                        throw ("can't find rt-view");
                    }
                    else {
                        return xPath[0];
                    }
                }
            };
            this.body = document.getElementsByTagName("BODY")[0];
            this.tagName = tagName;
            this.rootEle = getViewRoot(tagName);
            this.scriptManager = {};
            // if (routerMap && routerMap instanceof RouterMap) {
            //     this.routerMap = routerMap;
            // }
            // else {
            this.routerMap = new RouterMap();
            // }
            if (!this.routerMap.contains("")) {
                this.routerMap.set("", new RouteConfig(this.rootEle.innerHTML, ''));
            }
            this.oldHash = location.hash.replace("#", '');
            // this.newHash = location.hash.replace("#", '');
            (() => {
                window.onhashchange = (e) => {
                    console.log(location.hash);
                    this.$$refreshView(location.hash);
                };
                console.debug("bind success")
            })();
        };

        $$refreshView(newHash, isInit) {
            newHash = newHash.replace("#", '');
            if (this.routerMap.contains(newHash)) {
                //更新template
                this.rootEle.innerHTML = this.routerMap.get(newHash).template;
                this.oldHash = newHash;

                this.$$clearScript(newHash);
                this.$$evalScript(newHash);
                if (!isInit) {
                    //如果不是第一次加载，则通过新旧值检查
                    //旧模板html发生变化
                    var oldConfig = this.routerMap.get(this.oldHash);
                    oldConfig.template = this.rootEle.innerHTML;
                }
            }
            else {
                return;
            }
        };

        $$clearScript(anchor) {
            for (let a in this.scriptManager) {
                if (a != anchor) {
                    let sEle = document.getElementById('s_' + a);
                    if (sEle) {
                        this.body.removeChild(sEle);
                    }
                }
            }
        }

        $$evalScript(anchor) {
            console.debug("eval script of anchor " + anchor);
            try {
                let routerConfig = this.routerMap.get(anchor);
                let script = routerConfig.script || '';
                //用eval会让一些注册事件一直存在
                // eval('(' + script + ')');
                var newScript = document.createElement('script');
                newScript.id = "s_" + anchor;
                newScript.type = 'text/javascript';
                newScript.innerHTML = script;
                this.body.appendChild(newScript);
                this.scriptManager[anchor] = script;
            }
            catch (e) {
                throw (e);
            }
        };

        $$when(key, template, script) {
            this.routerMap.set(key, new RouteConfig(template, script));
            if (location.hash != '') {
                this.$$refreshView(location.hash, true);
            }

        }
    }
    function Router(tagName) {
        let _r = new RouterCore(tagName);
        let getResourcePromise = (url) => {
            return new Promise(function (resolve, reject) {
                var res;
                var xhr = function () {
                    if (window.XMLHttpRequest) {
                        return new XMLHttpRequest();
                    } else {
                        return new ActiveObject('Micrsorf.XMLHttp');
                    }
                }();

                xhr.onreadystatechange = function () {
                    switch (xhr.readyState) {
                        case 3 :
                            console.log(3, '正在接受部分响应.....');
                            res = xhr.responseText;
                            break;
                        case 4 :
                            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                                resolve(res);
                            } else {
                                reject();
                            }
                            break;
                    }
                };
                xhr.open('get', url);
                xhr.send(null);
            });
        };
        this.$when = (key, template, script) => {
            return _r.$$when(key, template, script);
        };
        this.$whenUrl = (key, templateUrl, scriptUrl) => {
            var template, script;
            Promise.all([getResourcePromise(templateUrl), getResourcePromise(scriptUrl)]).then(
                function (result) {
                    template = result[0];
                    script = result[1];
                    _r.$$when(key, template, script);
                }
            );
        }
    }

    return Router;
})();
