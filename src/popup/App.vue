<template>
    <div class="minimock-popup-wrap">
        <h3>FeTools功能</h3>
        <a-button type="primary" @click="gotoMock" class="btn-wrap">
            <a-icon type="api" /> 设置Mock数据
        </a-button>
        <a-button type="primary" @click="gotoJSON" class="btn-wrap">
            <a-icon type="code" /> 格式化JSON
        </a-button>
        <a-button type="primary" @click="gotoCompress" class="btn-wrap">
            <a-icon type="file-jpg" /> 压缩图片
        </a-button>
    </div>
</template>

<script>
export default {
    data() {
        return {};
    },
    mounted() {

    },
    methods: {
        init() {
        },
        gotoMock() {
            chrome.tabs.create({url: 'tab/tab.html'});
        },
        gotoJSON() {
            chrome.tabs.create({url: 'http://json.cn'});
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
}
.minimock-popup-wrap {
    width: 250px;
    padding: 15px 20px;
    .btn-wrap {
        width: 100%;
        margin-bottom: 10px;
    }
}
</style>
