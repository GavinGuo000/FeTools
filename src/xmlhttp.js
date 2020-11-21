/**
 * @file 对请求流程进行改造
 * @author gavinguo
 */

(function () {
    function modifyResponse(response) {
        let originalResponse = '';
        let modifiedResponse = '';
        let mockData = null;

        // 去除请求中的requestid
        let request = this.requestURL;
        if (this.requestURL.includes('&reqid')) {
            request = this.requestURL.split('&reqid')[0];
        }

        // 判断当前url是否配置了自定义数据
        try {
            let myMockDatas = window.localStorage.getItem('mockDatas');
            myMockDatas = JSON.parse(myMockDatas);
            mockData = myMockDatas.filter(item => {
                return !item.yapi && item.jsonbody && item.url.indexOf(request) > -1;
            });
            mockData = mockData[0];
        }
        catch (error) {
            mockData = null;
        }

        if (this.readyState === 4) {
            originalResponse = response.target.responseText;
            Object.defineProperty(this, 'responseText', {writable: true});
            modifiedResponse = JSON.parse(originalResponse);

            // 如果配置了自定义数据，执行下面操作
            if (mockData && mockData.url) {
                this.responseText = mockData.jsonbody;
                console.info(`%cFeTools mock成功(自定义数据)：${this.responseURL}`, 'color: green;');
            }
            else {
                this.responseText = modifiedResponse;
            }
        }
    }

    function openBypass(originalFunction) {
        return function (method, url) {
            // 保存请求相关参数
            this.requestMethod = method;
            this.requestURL = url;
            let mockData = null;

            // 去除请求中的requestid
            let request = this.requestURL;
            if (this.requestURL.includes('&reqid')) {
                request = this.requestURL.split('&reqid')[0];
            }

            // 判断当前的请求是否配置了yapi
            try {
                let myMockDatas = window.localStorage.getItem('mockDatas');
                myMockDatas = JSON.parse(myMockDatas);
                mockData = myMockDatas.filter(item => {
                    return item.yapi && item.url.indexOf(request) > -1;
                });
                mockData = mockData[0];
            } catch (error) {
                mockData = null;
            }

            // 如果配置了yapi，执行下面操作
            if (mockData && mockData.yapi) {
                arguments[1] = mockData.yapi;
                console.info(`%cFeTools mock成功(yapi数据)：${this.requestURL}`, 'color: green;');
            }

            this.addEventListener('readystatechange', modifyResponse);
            return originalFunction.apply(this, arguments);
        };
    }

    function sendBypass(originalFunction) {
        return function (data) {
            // 保存请求相关参数
            this.requestData = data;
            return originalFunction.apply(this, arguments);
        };
    }
    XMLHttpRequest.prototype.open = openBypass(XMLHttpRequest.prototype.open);
    XMLHttpRequest.prototype.send = sendBypass(XMLHttpRequest.prototype.send);
})();
