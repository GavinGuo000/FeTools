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
var currentTab;
var version = "1.0";

chrome.tabs.query( //get current Tab
    {
        currentWindow: true,
        active: true
    },
    function(tabArray) {
        currentTab = tabArray[0];
        chrome.debugger.attach({ //debug at current tab
            tabId: currentTab.id
        }, version, onAttach.bind(null, currentTab.id));
    }
)

function onAttach(tabId) {
    chrome.debugger.sendCommand({ //first enable the Network
        tabId: tabId
    }, "Network.enable");
    chrome.debugger.onEvent.addListener(allEventHandler);
}

function allEventHandler(debuggeeId, message, params) {
    // if (currentTab.id != debuggeeId.tabId) {
    //     return;
    // }
    if (message === "Network.responseReceived" && params.type !== "Image" && params.type !== "Script" && params.type !== "Stylesheet") {
        alert(JSON.stringify(params));
        // chrome.debugger.sendCommand({
        //     tabId: debuggeeId.tabId
        // }, "Network.getResponseBody", {
        //     "requestId": params.requestId
        // }, function(response) {
        //     alert(JSON.stringify(123));
        //     chrome.debugger.detach(debuggeeId);
        // });
    }
}

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