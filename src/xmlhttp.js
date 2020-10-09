(function() {
    function modifyResponse(response) {
        var original_response, modified_response;
        var mockData = null;

        try {
            let myMockDatas = window.localStorage.getItem('mockDatas');
            myMockDatas = JSON.parse(myMockDatas);
            mockData = myMockDatas[0];
        } catch (error) {
            mockData = null;
        }

        if (this.readyState === 4) {
            // 使用在 openBypass 中保存的相关参数判断是否需要修改
            if (
                this.responseURL.includes(mockData.url)
                && this.requestMethod
            ) {
                original_response = response.target.responseText;
                Object.defineProperty(this, "responseText", { writable: true });
                modified_response = JSON.parse(original_response);
                console.log(2233, response);
                // 根据 sendBypass 中保存的数据修改响应内容
                if (mockData.yapi) {
                    const me = this;
                    // this.responseText = original_response;
                    feToolAxios.post(mockData.yapi).then(function (res) {
                        me.responseText = res.data;
                    });
                }
                else {
                    this.responseText = mockData.jsonbody;
                }
            }
        }
    }

    function openBypass(original_function) {
        return function (method, url, async) {
            // 保存请求相关参数
            this.requestMethod = method;
            this.requestURL = url;

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