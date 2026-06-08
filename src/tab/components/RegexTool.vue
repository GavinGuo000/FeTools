<template>
    <div class="tool-panel">
        <h2 class="tool-title">正则测试</h2>
        <p class="tool-desc">实时测试正则表达式，高亮匹配结果并列出捕获分组。</p>
        <a-row :gutter="16" class="pattern-row">
            <a-col :span="18">
                <div class="tool-label">正则表达式</div>
                <a-input v-model="pattern" placeholder="如 \d{4}-\d{2}-\d{2}" @input="run" />
            </a-col>
            <a-col :span="6">
                <div class="tool-label">修饰符 (flags)</div>
                <a-input v-model="flags" placeholder="如 gi" @input="run" />
            </a-col>
        </a-row>

        <div class="tool-label">测试文本</div>
        <a-textarea v-model="text" :rows="8" placeholder="在此输入待匹配文本" @input="run" />

        <p class="tool-status error" v-if="error">{{error}}</p>
        <p class="tool-status ok" v-else>共匹配到 {{matches.length}} 处</p>

        <a-card class="tool-card" title="高亮预览" v-if="text">
            <div class="highlight" v-html="highlighted"></div>
        </a-card>

        <a-card class="tool-card" title="匹配详情" v-if="matches.length">
            <a-table
                :columns="columns"
                :data-source="matches"
                rowKey="index"
                size="small"
                :pagination="false"
            />
        </a-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            pattern: '',
            flags: 'g',
            text: '',
            error: '',
            matches: [],
            highlighted: '',
            columns: [
                {title: '序号', dataIndex: 'no', key: 'no', width: 70},
                {title: '匹配内容', dataIndex: 'match', key: 'match'},
                {title: '位置', dataIndex: 'index', key: 'index', width: 90},
                {title: '分组', dataIndex: 'groups', key: 'groups'}
            ]
        };
    },
    methods: {
        escapeHtml(str) {
            return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        },
        run() {
            this.error = '';
            this.matches = [];
            this.highlighted = this.escapeHtml(this.text);
            if (!this.pattern) {
                return;
            }
            let re;
            try {
                const flags = this.flags.includes('g') ? this.flags : this.flags + 'g';
                re = new RegExp(this.pattern, flags);
            }
            catch (e) {
                this.error = '正则表达式无效：' + e.message;
                return;
            }

            const result = [];
            let m;
            let guard = 0;
            while ((m = re.exec(this.text)) !== null && guard < 10000) {
                guard++;
                result.push({
                    no: result.length + 1,
                    match: m[0],
                    index: m.index,
                    groups: m.length > 1 ? m.slice(1).map((g, i) => `$${i + 1}=${g}`).join(', ') : '-'
                });
                if (m.index === re.lastIndex) {
                    re.lastIndex++;
                }
            }
            this.matches = result;

            // 生成高亮文本
            let html = '';
            let last = 0;
            re.lastIndex = 0;
            let mm;
            guard = 0;
            while ((mm = re.exec(this.text)) !== null && guard < 10000) {
                guard++;
                html += this.escapeHtml(this.text.slice(last, mm.index));
                html += `<mark>${this.escapeHtml(mm[0])}</mark>`;
                last = mm.index + mm[0].length;
                if (mm.index === re.lastIndex) {
                    re.lastIndex++;
                }
            }
            html += this.escapeHtml(this.text.slice(last));
            this.highlighted = html;
        }
    }
};
</script>

<style lang="scss" scoped>
.pattern-row {
    margin-bottom: 12px;
}
.tool-label {
    margin: 8px 0 6px;
    color: #666;
    font-weight: 500;
}
.tool-status {
    margin-top: 10px;
    &.error {
        color: #f5222d;
    }
    &.ok {
        color: #52c41a;
    }
}
.tool-card {
    margin-top: 16px;
}
.highlight {
    white-space: pre-wrap;
    word-break: break-all;
    font-family: monospace;
    line-height: 1.6;
    ::v-deep mark {
        background: #ffe58f;
        color: #d46b08;
        border-radius: 2px;
        padding: 0 1px;
    }
}
</style>
