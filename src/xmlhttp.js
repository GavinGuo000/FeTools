function modifyResponse(response) {

    var original_response, modified_response;

    if (this.readyState === 4) {
        // 使用在 openBypass 中保存的相关参数判断是否需要修改
        // if (this.requestUrl ... && this.requestMethod ...) {
            original_response = response.target.responseText;
            Object.defineProperty(this, "responseText", { writable: true });
            modified_response = JSON.parse(original_response);
            // 根据 sendBypass 中保存的数据修改响应内容
        this.responseText = JSON.stringify({ "status": 0, "data": [{ "id": 41, "name": "全新商业开发者平台上线12344", "hint": "全新商业开发者平台上线", "logoPath": "http://dev2.baidu.com/admin/assets/static_file/2019-09-06/68b4f75a3210d57305c0552b268a02ce.jpg", "linkedURL": "http://dev2.baidu.com/newdev2/dist/index.html#/content/?pageType=3&productlineId=3&noticeId=313", "bannerStatus": 1, "bannerIndex": 5, "lastOnlineTime": 1567760787641, "lastOfflineTime": 1567760787641, "editedUser": "jiangdengfeng", "updateTime": "2020-02-04T02:48:59.000+0000" }], "error": null });
        // }
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