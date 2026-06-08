<div align="center">
    <h1>FeTools</h1>
    <p>一款用于辅助前端开发的 Chrome 扩展工具箱</p>
</div>

## 快速开始

### 介绍
FeTools 是一个内置多种实用工具的 Chrome 扩展，帮助前端开发者更高效地完成日常调试与数据处理工作。

### 环境要求
- Node.js（建议 16 ~ 20；过高版本如 Node 24 也可，本项目已用 Dart `sass` 替代 `node-sass` 以兼容新版本）
- Chrome / Edge 等基于 Chromium 的浏览器

### 安装依赖
```bash
npm install
```
> 如果安装中途被打断导致 `node_modules` 损坏（出现 `Invalid Version` 或 `Cannot find module` 报错），
> 执行一次干净重装即可：`rm -rf node_modules package-lock.json && npm install`。

### 构建命令
```bash
npm run build        # 生产构建，产物输出到 dist/
npm run build:dev    # 开发构建（不压缩，含 sourcemap）
npm run watch:dev    # 开发模式 + 文件监听 + 热重载（推荐开发时使用）
```

## 如何运行 / 访问

> ⚠️ FeTools 是一个 **Chrome 扩展**，不是网站，**没有 `localhost` 网址可以打开**。
> `npm run watch:dev` 只负责把代码编译进 `dist/` 目录并监听改动，运行扩展需要把 `dist/` 加载进浏览器。

### 第一步：编译出 dist 目录
开发时在项目根目录运行（保持终端开启，它会一直监听文件变化并自动重新编译）：
```bash
npm run watch:dev
```
看到 webpack 输出 `Built at: ...` 且没有 `ERROR` 即表示编译成功，此时项目根目录下会生成 `dist/`。

### 第二步：把扩展加载进 Chrome
1. 打开 Chrome，地址栏输入 `chrome://extensions` 回车；
2. 打开右上角的 **「开发者模式 / Developer mode」** 开关；
3. 点击左上角 **「加载已解压的扩展程序 / Load unpacked」**；
4. 选择本项目的 **`dist/`** 目录（不是项目根目录）；
5. 加载成功后，浏览器工具栏会出现 FeTools 的图标。

### 第三步：使用扩展
- **点击工具栏的 FeTools 图标** → 弹出功能菜单（popup），可一键进入各个工具；
- 点击「设置 Mock 数据 / 格式化 JSON / 时间戳转换 …」会**新开一个标签页**打开工具箱页面；
  - 该页面的真实地址形如 `chrome-extension://<扩展ID>/tab/tab.html#json`，其中 `#json`、`#timestamp` 等哈希用于直达对应工具；
- **Mock 功能**作用于你正常浏览的业务网页：配置好规则后，刷新目标页面，被命中的请求即会被拦截替换（可在该页面的开发者工具 Console 看到 `FeTools mock成功` 的日志）。

### 热重载说明
- `watch:dev` 配合 `webpack-chrome-extension-reloader`，**修改源码保存后扩展会自动重新加载**，通常无需手动操作；
- 若改动了 `manifest.json` 或扩展未自动刷新，回到 `chrome://extensions` 点击该扩展卡片上的 **刷新/重新加载** 按钮即可；
- 已打开的工具箱标签页（tab 页）有时需手动刷新页面才会生效。

## 功能列表

通过浏览器右上角的扩展图标打开弹窗，可快速进入以下工具：

### 1. Mock 数据
拦截页面请求并替换响应，支持 **XMLHttpRequest** 与 **fetch** 两种方式：
- 自定义 JSON 响应数据
- 转发到 YAPI 地址（优先级高于自定义数据）
- 模拟响应延迟（毫秒，作用于 fetch 请求）
- 单条 / 批量开启关闭，一键清空
- Mock 配置的导入与导出（JSON 文件）

> 注意：YAPI 与自定义数据不可同时配置；配置 URL 时需去掉随机参数（如 reqid）。

### 2. JSON 工具
本地完成 JSON 的格式化、压缩、转义 / 去转义与合法性校验，无需跳转外部网站。

### 3. 时间戳转换
Unix 时间戳与日期时间互转，自动识别秒 / 毫秒，并实时显示当前时间戳。

### 4. 编码 / 解码
支持 URL、Base64、Unicode 三种常见编码的双向转换。

### 5. 颜色转换
HEX、RGB、HSL 三种格式互转，内置取色器与实时颜色预览。

### 6. 正则测试
实时测试正则表达式，高亮匹配结果并列出捕获分组。

## 技术栈
Vue 2 + Ant Design Vue + Webpack 4（Manifest V2）

## 如何贡献
* 联系作者 gavinguo
* 邮箱：guojiawen000@qq.com

## 讨论
### 常见问题
记录 Q&A

# LICENCE
MIT
