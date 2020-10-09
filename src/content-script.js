let mockDatas = [];

// 将Chrome扩展存储的数据，存入localStorage，并且将mock功能注入页面
chrome.storage.local.get(['listData'], result => {
    mockDatas = result.listData.filter(item => {
        return item.url.includes(location.host) && item.status;
    });

    // 如果存在mock数据，则将mock数据存入localStorage
    if (mockDatas.length > 0) {
        try {
            window.localStorage.setItem('mockDatas', JSON.stringify(mockDatas));
        } catch (error) {
            mockDatas = [];
        }
    }
    
    // 如果存在mock数据，则将mock功能注入页面
    if (mockDatas.length > 0) {
        const script1 = document.createElement('script');
        script1.setAttribute('type', 'text/javascript');
        script1.setAttribute('src', chrome.extension.getURL('myaxios.js'));
        document.documentElement.appendChild(script1);

        const script2 = document.createElement('script');
        script2.setAttribute('type', 'text/javascript');
        script2.setAttribute('src', chrome.extension.getURL('xmlhttp.js'));
        document.documentElement.appendChild(script2);

        console.info('%cFeTools Mock功能开启', 'color: green;');
    }
});
