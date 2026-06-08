<template>
    <div class="tool-panel">
        <h2 class="tool-title">时间戳转换</h2>
        <p class="tool-desc">在 Unix 时间戳与日期时间之间互转，支持秒/毫秒。</p>

        <a-card class="tool-card" title="当前时间">
            <div class="now-line">
                <span class="now-label">当前秒级时间戳：</span>
                <span class="now-value">{{nowSeconds}}</span>
                <a-button size="small" @click="copyText(String(nowSeconds))">复制</a-button>
            </div>
            <div class="now-line">
                <span class="now-label">当前毫秒时间戳：</span>
                <span class="now-value">{{nowMillis}}</span>
                <a-button size="small" @click="copyText(String(nowMillis))">复制</a-button>
            </div>
            <div class="now-line">
                <span class="now-label">当前时间：</span>
                <span class="now-value">{{nowText}}</span>
            </div>
        </a-card>

        <a-card class="tool-card" title="时间戳 → 日期">
            <div class="row">
                <a-input v-model="tsInput" placeholder="输入时间戳，秒或毫秒均可，如 1700000000" />
                <a-button type="primary" @click="tsToDate">转换</a-button>
            </div>
            <div class="result" v-if="tsResult">{{tsResult}}</div>
        </a-card>

        <a-card class="tool-card" title="日期 → 时间戳">
            <div class="row">
                <a-input v-model="dateInput" placeholder="输入日期，如 2026-06-08 15:30:00" />
                <a-button type="primary" @click="dateToTs">转换</a-button>
            </div>
            <div class="result" v-if="dateResult">{{dateResult}}</div>
        </a-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            nowSeconds: 0,
            nowMillis: 0,
            nowText: '',
            tsInput: '',
            tsResult: '',
            dateInput: '',
            dateResult: '',
            timer: null
        };
    },
    mounted() {
        this.tick();
        this.timer = setInterval(this.tick, 1000);
    },
    beforeDestroy() {
        clearInterval(this.timer);
    },
    methods: {
        tick() {
            const now = Date.now();
            this.nowMillis = now;
            this.nowSeconds = Math.floor(now / 1000);
            this.nowText = this.formatDate(new Date(now));
        },
        formatDate(d) {
            const pad = n => String(n).padStart(2, '0');
            return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} `
                + `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
        },
        tsToDate() {
            const raw = this.tsInput.trim();
            if (!/^\d+$/.test(raw)) {
                this.tsResult = '请输入纯数字时间戳';
                return;
            }
            // 10位按秒，13位按毫秒
            const ms = raw.length <= 10 ? Number(raw) * 1000 : Number(raw);
            const d = new Date(ms);
            if (isNaN(d.getTime())) {
                this.tsResult = '无效的时间戳';
                return;
            }
            this.tsResult = `本地时间：${this.formatDate(d)}\nISO：${d.toISOString()}\nUTC：${d.toUTCString()}`;
        },
        dateToTs() {
            const raw = this.dateInput.trim();
            const d = new Date(raw.replace(/-/g, '/'));
            if (isNaN(d.getTime())) {
                this.dateResult = '无法解析日期，请使用如 2026-06-08 15:30:00 的格式';
                return;
            }
            this.dateResult = `秒级：${Math.floor(d.getTime() / 1000)}\n毫秒：${d.getTime()}`;
        },
        copyText(text) {
            navigator.clipboard.writeText(text).then(() => {
                this.$message.success('已复制');
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.tool-card {
    margin-bottom: 16px;
}
.now-line {
    margin-bottom: 8px;
    .now-label {
        color: #666;
    }
    .now-value {
        font-weight: 600;
        margin-right: 10px;
    }
}
.row {
    display: flex;
    align-items: center;
    .ant-input {
        margin-right: 10px;
    }
}
.result {
    margin-top: 12px;
    padding: 10px 12px;
    background: #f6f8fa;
    border-radius: 4px;
    white-space: pre-line;
    font-family: monospace;
}
</style>
