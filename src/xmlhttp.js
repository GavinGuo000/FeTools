/**
 * @file 对请求流程进行改造，支持 XMLHttpRequest 与 fetch 两种方式的 mock
 * @author gavinguo
 */

(function () {
    // 读取当前页面配置的 mock 数据
    function getMockDatas() {
        try {
            const raw = window.localStorage.getItem('mockDatas');
            const list = JSON.parse(raw);
            return Array.isArray(list) ? list : [];
        }
        catch (error) {
            return [];
        }
    }

    // 去除请求中的随机参数 reqid
    function normalizeUrl(url) {
        if (url && url.includes('&reqid')) {
            return url.split('&reqid')[0];
        }
        return url || '';
    }

    // 根据请求 url 命中对应的 mock 配置
    function matchMock(url, predicate) {
        const request = normalizeUrl(url);
        const hit = getMockDatas().filter(item => {
            return item.url && item.url.indexOf(request) > -1 && predicate(item);
        });
        return hit[0] || null;
    }

    // 延迟工具
    function wait(ms) {
        const delay = Number(ms);
        return new Promise(resolve => {
            setTimeout(resolve, delay > 0 ? delay : 0);
        });
    }

    /* ---------------- XMLHttpRequest 拦截 ---------------- */

    function modifyResponse(response) {
        let originalResponse = '';
        let modifiedResponse = '';

        // 命中自定义数据(非 yapi)的 mock
        const mockData = matchMock(this.requestURL, item => !item.yapi && item.jsonbody);

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

            // 命中配置了 yapi 的 mock
            const mockData = matchMock(this.requestURL, item => !!item.yapi);

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

    window.isFetools = true;
    XMLHttpRequest.prototype.open = openBypass(XMLHttpRequest.prototype.open);
    XMLHttpRequest.prototype.send = sendBypass(XMLHttpRequest.prototype.send);

    /* ---------------- fetch 拦截 ---------------- */

    if (typeof window.fetch === 'function') {
        const originalFetch = window.fetch.bind(window);

        window.fetch = function (input, init) {
            const url = typeof input === 'string' ? input : (input && input.url);

            // 自定义数据 mock：直接返回构造的响应
            const customMock = matchMock(url, item => !item.yapi && item.jsonbody);
            if (customMock) {
                console.info(`%cFeTools mock成功(fetch 自定义数据)：${url}`, 'color: green;');
                return wait(customMock.delay).then(() => {
                    return new Response(customMock.jsonbody, {
                        status: 200,
                        headers: {'Content-Type': 'application/json'}
                    });
                });
            }

            // yapi mock：转发到 yapi 地址
            const yapiMock = matchMock(url, item => !!item.yapi);
            if (yapiMock && yapiMock.yapi) {
                console.info(`%cFeTools mock成功(fetch yapi数据)：${url}`, 'color: green;');
                return wait(yapiMock.delay).then(() => originalFetch(yapiMock.yapi, init));
            }

            return originalFetch(input, init);
        };
    }
})();
