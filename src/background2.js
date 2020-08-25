// Chrome DevTools Extension中不能使用console.log
const log = (...args) => chrome.devtools.inspectedWindow.eval(`
    console.log(...${JSON.stringify(args)});
`);

// 1111111
// chrome.webRequest.onBeforeRequest.addListener(
//     function (details) {
//         // 截取ajax请求
//         if (details['type'] === 'xmlhttprequest') {
//             messageTab(details);
//         }
//     },
//     {urls: ['<all_urls>']},
//     ['blocking', 'extraHeaders', 'requestBody']
// );

// chrome.webRequest.onCompleted.addListener(
//     function (details) {
//         if (details['type'] === 'xmlhttprequest') {
//             // alert(JSON.stringify(details));
//         }
//     },
//     {
//         urls: ['<all_urls>']
//     },
//     ['extraHeaders', 'responseHeaders']
// );


// // 向标签页发送信息
// function messageTab(Ymessage) {
//     chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
//         chrome.tabs.sendMessage(tabs[0].id, {Ymessage}, function (response) {

//         });
//     });
// }

// 222222
// var currentTab;
// var version = "1.0";

// chrome.tabs.query( //get current Tab
//     {
//         currentWindow: true,
//         active: true
//     },
//     function (tabArray) {
//         currentTab = tabArray[0];
//         chrome.debugger.attach({ //debug at current tab
//             tabId: currentTab.id
//         }, version, onAttach.bind(null, currentTab.id));
//     }
// )

// function onAttach(tabId) {
//     chrome.debugger.sendCommand({ //first enable the Network
//         tabId: tabId
//     }, "Network.enable");
//     chrome.debugger.onEvent.addListener(allEventHandler);
// }

// function allEventHandler(debuggeeId, message, params) {
//     // if (currentTab.id != debuggeeId.tabId) {
//     //     return;
//     // }
//     if (message === "Network.responseReceived" && params.type !== "Image" && params.type !== "Script" && params.type !== "Stylesheet") {
//         alert(JSON.stringify(params));
//         // chrome.debugger.sendCommand({
//         //     tabId: debuggeeId.tabId
//         // }, "Network.getResponseBody", {
//         //     "requestId": params.requestId
//         // }, function(response) {
//         //     alert(JSON.stringify(123));
//         //     chrome.debugger.detach(debuggeeId);
//         // });
//     }
// }

// 3333333
// 注册回调，每一个http请求响应后，都触发该回调
// chrome.devtools.network.onRequestFinished.addListener(async (...args) => {
//     alert(1);
//     try {
//         const [{
//             // 请求的类型，查询参数，以及url
//             request: { method, queryString, url },

//             // 该方法可用于获取响应体
//             getContent,
//         }] = args;

//         log(method, queryString, url);

//         // 将callback转为await promise
//         // warn: content在getContent回调函数中，而不是getContent的返回值
//         const content = await new Promise((res, rej) => getContent(res));
//         log(content);
//     } catch (err) {
//         log(err.stack || err.toString());
//     }
// });

// var __XMLHttpRequest = XMLHttpRequest;
// window.XMLHttpRequest = function () {
//     var resultObj = {
//         xhr: new __XMLHttpRequest(),
//         onreadystatechange: null,
//         open: function (method, url, async) {
//             this.url = url;
//             this.method = method;
//         },
//         send: function (data) {
//             //用异步改下时序，让send 在 onreadystatechange  之后再执行
//             setTimeout(() => {
//                 if (this.url.indexOf("http://dev2.baidu.com/newdev2/banner/list.ajax") >= 0) {    //匹配url规则，这个是业务代码省略掉了，先用固定地址
//                     this.readyState = 4;
//                     this.status = 200;
//                     this.responseText = "{result:'hello,baidu'}"; //为了演示先写死报文了
//                     this.onreadystatechange({ mock: true });
//                 } else {
//                     this.xhr.open(this.method, this.url);
//                     this.xhr.send(data);
//                 }
//             }, 0);
//         }
//     }
//     Object.defineProperty(resultObj, "onreadystatechange", {
//         get: function () {
//             return this.xhr.onreadystatechange;
//         },
//         set: function (func) {
//             this.xhr.onreadystatechange = (arg) => {
//                 console.log(5566, func);
//                 if (arg.mock) { //mock接口，直接触发回调 
//                     func();
//                 } else { //没匹配到，把原始xhr得到的数据复制回来
//                     this.readyState = this.xhr.readyState;
//                     this.status = this.xhr.status;
//                     this.responseText = this.xhr.responseText;
//                     func();
//                 }
//             };
//         }
//     })
//     return resultObj;
// }

// var xhr = new XMLHttpRequest()
// xhr.open("post", "http://dev2.baidu.com/newdev2/banner/list.ajax");
// xhr.send();
// xhr.onreadystatechange = function () {
//     console.log(123, xhr.responseText)
// }

// var proxy = new Proxy(XMLHttpRequest, {
//     get: function (target, property) {
//         console.log(123, target, property);
//     }
// });

// const newReadystatechange = window.XMLHttpRequest.prototype.onreadystatechange;

// window.XMLHttpRequest.prototype = {
//     onreadystatechange: {
//         alert(1);
//     }
// }

// 重写数组方法
// let oldArrayPrototype = Array.prototype;
// let proto = Object.create(oldArrayPrototype);
// ['push', 'shift', 'unshift'].forEach((met) => {
//     proto[met] = function () { // 函数劫持 （重写函数 继续调用旧方法）
//         upDataView(); // 切片编程
//         oldArrayPrototype[met].call(this, ...arguments)
//     }
// });

// function observer(target) {
//     if (typeof target !== 'object' || target === null) {
//         return target
//     }
//     if (Array.isArray(target)) {
//         target.__proto__ = proto
//         // Object.setPrototypeOf(target, proto)
//     }
//     for (let key in target) {
//         defineReactive(target, key, target[key])
//     }
// }

// function defineReactive(target, key, value) {
//     observer(value); // 递归调用
//     Object.defineProperty(target, key, {
//         get() {
//             return value
//         },
//         set(newValue) {
//             if (newValue !== value) {
//                 observer(newValue); // 新属性添加get set
//                 upDataView();
//                 value = newValue
//             }
//         }
//     })
// }

// function upDataView() {
//     console.log('视图更新')
// }

// // 使用 Object.defineProperty 添加 getter setter
// let data = { name: 'wyq', age: 18 };
// observer(data);
// data.name = '王瘦瘦';


// (function () {
//     if (typeof window.CustomEvent === "function") return false;

//     function CustomEvent(event, params) {
//         params = params || { bubbles: false, cancelable: false, detail: undefined };
//         var evt = document.createEvent('CustomEvent');
//         evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
//         return evt;
//     }

//     CustomEvent.prototype = window.Event.prototype;

//     window.CustomEvent = CustomEvent;
// })();
// (function () {
//     function ajaxEventTrigger(event) {
//         var ajaxEvent = new CustomEvent(event, { detail: this });
//         window.dispatchEvent(ajaxEvent);
//     }

//     var oldXHR = window.XMLHttpRequest;

//     function newXHR() {
//         var realXHR = new oldXHR();

//         realXHR.addEventListener('abort', function () { ajaxEventTrigger.call(this, 'ajaxAbort'); }, false);

//         realXHR.addEventListener('error', function () { ajaxEventTrigger.call(this, 'ajaxError'); }, false);

//         realXHR.addEventListener('load', function () { ajaxEventTrigger.call(this, 'ajaxLoad'); }, false);

//         realXHR.addEventListener('loadstart', function () { ajaxEventTrigger.call(this, 'ajaxLoadStart'); }, false);

//         realXHR.addEventListener('progress', function () { ajaxEventTrigger.call(this, 'ajaxProgress'); }, false);

//         realXHR.addEventListener('timeout', function () { ajaxEventTrigger.call(this, 'ajaxTimeout'); }, false);

//         realXHR.addEventListener('loadend', function () { ajaxEventTrigger.call(this, 'ajaxLoadEnd'); }, false);

//         realXHR.addEventListener('readystatechange', function () { alert(1);ajaxEventTrigger.call(this, 'ajaxReadyStateChange'); }, false);

//         return realXHR;
//     }

//     window.XMLHttpRequest = newXHR;
// })();