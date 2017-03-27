/**
 * Created by Leon on 17/3/27.
 */
// var core = require("../src/core/Core");
var Map = require("../src/core/RouteMap").RouteMap;
var Config = require("../src/core/RouteMap").RouteConfig;
var map = new Map();
var config = new Config(null,null,"template/template.html?v=1","js/script.js");
config.async(()=>{});