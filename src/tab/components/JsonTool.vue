<template>
    <div class="tool-panel">
        <h2 class="tool-title">JSON 工具</h2>
        <p class="tool-desc">在本地完成 JSON 的格式化、压缩、转义与校验，无需跳转外部网站。</p>
        <div class="tool-toolbar">
            <a-button type="primary" @click="format"><a-icon type="align-left" /> 格式化</a-button>
            <a-button @click="minify"><a-icon type="shrink" /> 压缩</a-button>
            <a-button @click="escapeStr"><a-icon type="enter" /> 转义</a-button>
            <a-button @click="unescapeStr"><a-icon type="rollback" /> 去转义</a-button>
            <a-button @click="copy"><a-icon type="copy" /> 复制结果</a-button>
            <a-button type="danger" @click="clear"><a-icon type="delete" /> 清空</a-button>
            <span class="tool-status" :class="{error: !!error, ok: valid}">{{statusText}}</span>
        </div>
        <a-row :gutter="16">
            <a-col :span="12">
                <div class="tool-label">输入</div>
                <a-textarea v-model="input" :rows="22" placeholder='在此粘贴 JSON，例如 {"a":1}' />
            </a-col>
            <a-col :span="12">
                <div class="tool-label">输出</div>
                <a-textarea v-model="output" :rows="22" placeholder="结果将显示在这里" />
            </a-col>
        </a-row>
    </div>
</template>

<script>
export default {
    data() {
        return {
            input: '',
            output: '',
            error: '',
            valid: false
        };
    },
    computed: {
        statusText() {
            if (this.error) {
                return `✗ ${this.error}`;
            }
            if (this.valid) {
                return '✓ JSON 合法';
            }
            return '';
        }
    },
    methods: {
        parse() {
            this.error = '';
            this.valid = false;
            try {
                const data = JSON.parse(this.input);
                this.valid = true;
                return data;
            }
            catch (e) {
                this.error = e.message;
                return undefined;
            }
        },
        format() {
            const data = this.parse();
            if (this.valid) {
                this.output = JSON.stringify(data, null, 4);
            }
        },
        minify() {
            const data = this.parse();
            if (this.valid) {
                this.output = JSON.stringify(data);
            }
        },
        escapeStr() {
            this.error = '';
            this.valid = false;
            this.output = JSON.stringify(this.input).replace(/^"|"$/g, '');
        },
        unescapeStr() {
            this.error = '';
            this.valid = false;
            try {
                this.output = JSON.parse(`"${this.input.replace(/^"|"$/g, '')}"`);
            }
            catch (e) {
                this.error = '无法去除转义：' + e.message;
            }
        },
        copy() {
            if (!this.output) {
                this.$message.warning('没有可复制的内容');
                return;
            }
            navigator.clipboard.writeText(this.output).then(() => {
                this.$message.success('已复制到剪贴板');
            });
        },
        clear() {
            this.input = '';
            this.output = '';
            this.error = '';
            this.valid = false;
        }
    }
};
</script>

<style lang="scss" scoped>
.tool-toolbar {
    margin-bottom: 12px;
    button {
        margin-right: 8px;
        margin-bottom: 6px;
    }
}
.tool-status {
    margin-left: 6px;
    &.error {
        color: #f5222d;
    }
    &.ok {
        color: #52c41a;
    }
}
.tool-label {
    margin-bottom: 6px;
    color: #666;
    font-weight: 500;
}
</style>
