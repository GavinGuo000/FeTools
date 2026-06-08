<template>
    <div class="minimock-popup-wrap">
        <h3>FeTools 功能</h3>
        <a-button type="primary" @click="openTool('mock')" class="btn-wrap">
            <a-icon type="api" /> 设置Mock数据
        </a-button>
        <a-button type="primary" @click="openTool('json')" class="btn-wrap">
            <a-icon type="code" /> 格式化JSON
        </a-button>
        <a-button type="primary" @click="openTool('timestamp')" class="btn-wrap">
            <a-icon type="clock-circle" /> 时间戳转换
        </a-button>
        <a-button type="primary" @click="openTool('encode')" class="btn-wrap">
            <a-icon type="lock" /> 编码 / 解码
        </a-button>
        <a-button type="primary" @click="openTool('color')" class="btn-wrap">
            <a-icon type="bg-colors" /> 颜色转换
        </a-button>
        <a-button type="primary" @click="openTool('regex')" class="btn-wrap">
            <a-icon type="filter" /> 正则测试
        </a-button>
        <a-divider class="divider" />
        <a-button @click="gotoCompress" class="btn-wrap">
            <a-icon type="file-jpg" /> 压缩图片 (TinyPNG)
        </a-button>
    </div>
</template>

<script>
export default {
    data() {
        return {};
    },
    methods: {
        openTool(tool) {
            const url = chrome.extension.getURL(`tab/tab.html#${tool}`);
            chrome.tabs.create({url});
        },
        gotoCompress() {
            chrome.tabs.create({url: 'https://tinypng.com'});
        }
    }
};
</script>

<style lang="scss" scoped>
h3 {
    color: #333;
    border-bottom: 1px solid #c02020;
    padding-bottom: 8px;
}
.minimock-popup-wrap {
    width: 250px;
    padding: 15px 20px;
    .btn-wrap {
        width: 100%;
        margin-bottom: 10px;
    }
    .divider {
        margin: 6px 0 12px;
    }
}
</style>
