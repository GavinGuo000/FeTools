<template>
    <a-layout class="fetools-layout">
        <a-layout-sider theme="dark" :width="210">
            <div class="logo">
                <a-icon type="tool" /> FeTools 工具箱
            </div>
            <a-menu theme="dark" mode="inline" :selected-keys="[current]" @click="onMenu">
                <a-menu-item key="mock"><a-icon type="api" /><span>Mock 数据</span></a-menu-item>
                <a-menu-item key="json"><a-icon type="code" /><span>JSON 工具</span></a-menu-item>
                <a-menu-item key="timestamp"><a-icon type="clock-circle" /><span>时间戳转换</span></a-menu-item>
                <a-menu-item key="encode"><a-icon type="lock" /><span>编码 / 解码</span></a-menu-item>
                <a-menu-item key="color"><a-icon type="bg-colors" /><span>颜色转换</span></a-menu-item>
                <a-menu-item key="regex"><a-icon type="filter" /><span>正则测试</span></a-menu-item>
            </a-menu>
        </a-layout-sider>
        <a-layout>
            <a-layout-content class="fetools-content">
                <keep-alive>
                    <component :is="currentComp" />
                </keep-alive>
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>

<script>
import Mock from './components/Mock.vue';
import JsonTool from './components/JsonTool.vue';
import TimestampTool from './components/TimestampTool.vue';
import EncodeTool from './components/EncodeTool.vue';
import ColorTool from './components/ColorTool.vue';
import RegexTool from './components/RegexTool.vue';

const compMap = {
    mock: Mock,
    json: JsonTool,
    timestamp: TimestampTool,
    encode: EncodeTool,
    color: ColorTool,
    regex: RegexTool
};

export default {
    components: {Mock, JsonTool, TimestampTool, EncodeTool, ColorTool, RegexTool},
    data() {
        const hash = (window.location.hash || '').replace('#', '');
        return {
            current: compMap[hash] ? hash : 'mock'
        };
    },
    computed: {
        currentComp() {
            return compMap[this.current] || Mock;
        }
    },
    mounted() {
        window.addEventListener('hashchange', this.onHashChange);
    },
    beforeDestroy() {
        window.removeEventListener('hashchange', this.onHashChange);
    },
    methods: {
        onMenu({key}) {
            this.current = key;
            window.location.hash = key;
        },
        onHashChange() {
            const hash = (window.location.hash || '').replace('#', '');
            if (compMap[hash]) {
                this.current = hash;
            }
        }
    }
};
</script>

<style lang="scss">
html, body {
    margin: 0;
    padding: 0;
}
.fetools-layout {
    min-height: 100vh;
    .logo {
        height: 56px;
        line-height: 56px;
        padding-left: 20px;
        color: #fff;
        font-size: 16px;
        font-weight: 600;
        background: rgba(255, 255, 255, 0.05);
        white-space: nowrap;
        overflow: hidden;
    }
    .ant-layout-sider {
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        overflow: auto;
    }
    .fetools-content {
        margin-left: 210px;
        min-height: 100vh;
        background: #fff;
    }
}
.tool-panel {
    padding: 24px 28px;
    .tool-title {
        margin: 0 0 4px;
        font-size: 20px;
        color: #233050;
    }
    .tool-desc {
        margin: 0 0 18px;
        color: #999;
    }
}
</style>
