/**
 * Created by Leon on 17/3/27.
 */
/**
 * Created by Leon on 17/3/27.
 */
module.exports = {
    getXPath: (tagName = "rt-view") => {
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
    }
};