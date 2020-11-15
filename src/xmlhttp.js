(function() {
    function modifyResponse(response) {
        var original_response, modified_response;
        var mockData = null;
        var me = this;

        try {
            let myMockDatas = window.localStorage.getItem('mockDatas');
            myMockDatas = JSON.parse(myMockDatas);
            mockData = myMockDatas.filter(item => {
                return me.responseURL.includes(item.url);
            });
            mockData = mockData[0];
        } catch (error) {
            mockData = null;
        }

        if (this.readyState === 4) {
            // 使用在 openBypass 中保存的相关参数判断是否需要修改
            if (mockData && mockData.url && this.responseURL.includes(mockData.url)) {
                original_response = response.target.responseText;
                Object.defineProperty(this, "responseText", { writable: true });
                modified_response = JSON.parse(original_response);

                // 根据 sendBypass 中保存的数据修改响应内容
                if (mockData.yapi) {
                    this.responseText = modified_response;
                }
                else {
                    this.responseText = mockData.jsonbody;
                    console.info(`%cFeTools mock成功(自定义数据)：${this.responseURL}`, 'color: green;');
                }
            }
        }
    }

    function openBypass(original_function) {
        return function (method, url) {
            // 保存请求相关参数
            this.requestMethod = method;
            this.requestURL = url;
            var mockData = null;
            var me = this;

            try {
                let myMockDatas = window.localStorage.getItem('mockDatas');
                myMockDatas = JSON.parse(myMockDatas);
                mockData = myMockDatas.filter(item => {
                    return item.yapi && item.yapi.includes(me.requestURL);
                });
                mockData = mockData[0];
            } catch (error) {
                mockData = null;
            }
            
            if (mockData && mockData.yapi && mockData.url.includes(this.requestURL)) {
                arguments[1] = mockData.yapi;
                console.info(`%cFeTools mock成功(yapi数据)：${this.requestURL}`, 'color: green;');
            }
            
            this.addEventListener("readystatechange", modifyResponse);
            return original_function.apply(this, arguments);
        };
    }

    function sendBypass(original_function) {
        return function (data) {
            // 保存请求相关参数
            this.requestData = data;
            return original_function.apply(this, arguments);
        };
    }
    XMLHttpRequest.prototype.open = openBypass(XMLHttpRequest.prototype.open);
    XMLHttpRequest.prototype.send = sendBypass(XMLHttpRequest.prototype.send);
})();