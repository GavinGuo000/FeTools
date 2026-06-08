<template>
    <div class="tool-panel">
        <h2 class="tool-title">编码 / 解码</h2>
        <p class="tool-desc">支持 URL、Base64、Unicode 三种常见编码的双向转换。</p>
        <a-radio-group v-model="type" button-style="solid" class="type-group">
            <a-radio-button value="url">URL</a-radio-button>
            <a-radio-button value="base64">Base64</a-radio-button>
            <a-radio-button value="unicode">Unicode</a-radio-button>
        </a-radio-group>
        <div class="tool-toolbar">
            <a-button type="primary" @click="encode"><a-icon type="arrow-down" /> 编码</a-button>
            <a-button @click="decode"><a-icon type="arrow-up" /> 解码</a-button>
            <a-button @click="swap"><a-icon type="swap" /> 交换</a-button>
            <a-button @click="copy"><a-icon type="copy" /> 复制结果</a-button>
            <a-button type="danger" @click="clear"><a-icon type="delete" /> 清空</a-button>
            <span class="tool-status error" v-if="error">{{error}}</span>
        </div>
        <a-row :gutter="16">
            <a-col :span="12">
                <div class="tool-label">输入</div>
                <a-textarea v-model="input" :rows="18" placeholder="在此输入待处理文本" />
            </a-col>
            <a-col :span="12">
                <div class="tool-label">输出</div>
                <a-textarea v-model="output" :rows="18" placeholder="结果将显示在这里" />
            </a-col>
        </a-row>
    </div>
</template>

<script>
export default {
    data() {
        return {
            type: 'url',
            input: '',
            output: '',
            error: ''
        };
    },
    methods: {
        encode() {
            this.error = '';
            try {
                if (this.type === 'url') {
                    this.output = encodeURIComponent(this.input);
                }
                else if (this.type === 'base64') {
                    this.output = btoa(unescape(encodeURIComponent(this.input)));
                }
                else {
                    this.output = this.input.replace(/[\s\S]/g, c => {
                        return '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0');
                    });
                }
            }
            catch (e) {
                this.error = '编码失败：' + e.message;
            }
        },
        decode() {
            this.error = '';
            try {
                if (this.type === 'url') {
                    this.output = decodeURIComponent(this.input);
                }
                else if (this.type === 'base64') {
                    this.output = decodeURIComponent(escape(atob(this.input)));
                }
                else {
                    this.output = this.input.replace(/\\u([\da-fA-F]{4})/g, (m, g) => {
                        return String.fromCharCode(parseInt(g, 16));
                    });
                }
            }
            catch (e) {
                this.error = '解码失败：输入可能不是合法的' + this.type + '内容';
            }
        },
        swap() {
            const tmp = this.input;
            this.input = this.output;
            this.output = tmp;
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
        }
    }
};
</script>

<style lang="scss" scoped>
.type-group {
    margin-bottom: 14px;
}
.tool-toolbar {
    margin-bottom: 12px;
    button {
        margin-right: 8px;
        margin-bottom: 6px;
    }
}
.tool-status.error {
    margin-left: 6px;
    color: #f5222d;
}
.tool-label {
    margin-bottom: 6px;
    color: #666;
    font-weight: 500;
}
</style>
