/**
 * Created by Leon on 17/3/27.
 */
module.exports = {
    getResourcePromise: (url) => {
        return new Promise((resolve, reject) => {
            var res;
            var xhr = (() => {
                if (typeof window != "undefined" && window.XMLHttpRequest) {
                    return new XMLHttpRequest();
                } else {
                    return new ActiveObject('Micrsorf.XMLHttp');
                }
            })();

            xhr.onreadystatechange = () => {
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
    },
    getEmptyPromise: () => {
        return new Promise((resolve, reject) => {
            resolve();
        })
    }
}
;