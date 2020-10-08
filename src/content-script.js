// // 命名空间
// let ajax_interceptor_qoweifjqon = {
//     originalXHR: window.XMLHttpRequest,
//     myXHR: function () {
//         alert(4);
//         const modifyResponse = () => {
//             alert(1);
//             this.responseText = {a:1};
//             this.response = { a: 1 };
//         }
//         const xhr = new ajax_interceptor_qoweifjqon.originalXHR;
//         for (let attr in xhr) {
            
//             if (attr === 'onreadystatechange') {
//                 xhr.onreadystatechange = (...args) => {
//                     alert(2);
//                     if (this.readyState == 4) {
//                         // 开启拦截
//                         modifyResponse();
//                     }
//                     this.onreadystatechange && this.onreadystatechange.apply(this, args);
//                 }
//                 continue;
//             } else if (attr === 'onload') {
//                 xhr.onload = (...args) => {
//                     alert(3);
//                     // 开启拦截
//                     modifyResponse();
//                     this.onload && this.onload.apply(this, args);
//                 }
//                 continue;
//             }

//             if (typeof xhr[attr] === 'function') {
//                 this[attr] = xhr[attr].bind(xhr);
//             } else {
//                 // responseText和response不是writeable的，但拦截时需要修改它，所以修改就存储在this[`_${attr}`]上
//                 if (attr === 'responseText' || attr === 'response') {
//                     Object.defineProperty(this, attr, {
//                         get: () => this[`_${attr}`] == undefined ? xhr[attr] : this[`_${attr}`],
//                         set: (val) => this[`_${attr}`] = val,
//                         enumerable: true
//                     });
//                 } else {
//                     Object.defineProperty(this, attr, {
//                         get: () => xhr[attr],
//                         set: (val) => xhr[attr] = val,
//                         enumerable: true
//                     });
//                 }
//             }
//         }
//     }
// };
// window.XMLHttpRequest = ajax_interceptor_qoweifjqon.myXHR;

window.chromes = chrome;
const script = document.createElement('script');
script.setAttribute('type', 'text/javascript');
script.setAttribute('src', chrome.extension.getURL('xmlhttp.js'));
document.documentElement.appendChild(script);
