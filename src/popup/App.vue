<template>
    <div class="minimock-popup-wrap">
        <h3>miniMock功能</h3>
        <a-button type="primary" @click="gotoMock" class="btn-wrap">
            <a-icon type="api" /> 设置Mock数据
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
            chrome.tabs.create({url: 'chrome-extension://pohfmpdhieoadhehnfgkjjmdaebcanif/tab/tab.html'});
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
    }
}
</style>
