<template>
    <div class="tool-panel">
        <h2 class="tool-title">颜色转换</h2>
        <p class="tool-desc">在 HEX、RGB、HSL 之间互转，并实时预览颜色。</p>
        <a-row :gutter="24">
            <a-col :span="14">
                <div class="field">
                    <label>HEX</label>
                    <a-input v-model="hex" placeholder="#1890ff" @change="fromHex" />
                </div>
                <div class="field">
                    <label>RGB</label>
                    <a-input v-model="rgb" placeholder="rgb(24, 144, 255)" @change="fromRgb" />
                </div>
                <div class="field">
                    <label>HSL</label>
                    <a-input v-model="hsl" placeholder="hsl(209, 100%, 55%)" @change="fromHsl" />
                </div>
                <div class="field">
                    <label>取色器</label>
                    <input type="color" :value="hexForPicker" @input="fromPicker" class="picker" />
                </div>
                <p class="tool-status error" v-if="error">{{error}}</p>
            </a-col>
            <a-col :span="10">
                <div class="preview" :style="{background: hexForPicker}"></div>
                <div class="preview-text">{{hex}}</div>
            </a-col>
        </a-row>
    </div>
</template>

<script>
export default {
    data() {
        return {
            hex: '#1890ff',
            rgb: 'rgb(24, 144, 255)',
            hsl: 'hsl(209, 100%, 55%)',
            error: ''
        };
    },
    computed: {
        hexForPicker() {
            return /^#[0-9a-fA-F]{6}$/.test(this.hex) ? this.hex : '#000000';
        }
    },
    methods: {
        syncFromRgb(r, g, b) {
            this.error = '';
            this.hex = '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
            this.rgb = `rgb(${r}, ${g}, ${b})`;
            const [h, s, l] = this.rgbToHsl(r, g, b);
            this.hsl = `hsl(${h}, ${s}%, ${l}%)`;
        },
        fromHex() {
            const m = this.hex.trim().replace(/^#/, '');
            const full = m.length === 3 ? m.split('').map(c => c + c).join('') : m;
            if (!/^[0-9a-fA-F]{6}$/.test(full)) {
                this.error = 'HEX 格式不正确';
                return;
            }
            const r = parseInt(full.slice(0, 2), 16);
            const g = parseInt(full.slice(2, 4), 16);
            const b = parseInt(full.slice(4, 6), 16);
            this.syncFromRgb(r, g, b);
        },
        fromRgb() {
            const m = this.rgb.match(/(\d+)\D+(\d+)\D+(\d+)/);
            if (!m) {
                this.error = 'RGB 格式不正确';
                return;
            }
            const [r, g, b] = [m[1], m[2], m[3]].map(Number);
            if ([r, g, b].some(v => v > 255)) {
                this.error = 'RGB 分量需在 0-255 之间';
                return;
            }
            this.syncFromRgb(r, g, b);
        },
        fromHsl() {
            const m = this.hsl.match(/(\d+)\D+(\d+)\D+(\d+)/);
            if (!m) {
                this.error = 'HSL 格式不正确';
                return;
            }
            const [h, s, l] = [m[1], m[2], m[3]].map(Number);
            const [r, g, b] = this.hslToRgb(h, s, l);
            this.syncFromRgb(r, g, b);
        },
        fromPicker(e) {
            this.hex = e.target.value;
            this.fromHex();
        },
        rgbToHsl(r, g, b) {
            r /= 255; g /= 255; b /= 255;
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            let h = 0;
            let s = 0;
            const l = (max + min) / 2;
            const d = max - min;
            if (d !== 0) {
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    default: h = (r - g) / d + 4;
                }
                h /= 6;
            }
            return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
        },
        hslToRgb(h, s, l) {
            h /= 360; s /= 100; l /= 100;
            let r;
            let g;
            let b;
            if (s === 0) {
                r = g = b = l;
            }
            else {
                const hue2rgb = (p, q, t) => {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1 / 6) return p + (q - p) * 6 * t;
                    if (t < 1 / 2) return q;
                    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                    return p;
                };
                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                const p = 2 * l - q;
                r = hue2rgb(p, q, h + 1 / 3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1 / 3);
            }
            return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
        }
    }
};
</script>

<style lang="scss" scoped>
.field {
    margin-bottom: 16px;
    label {
        display: block;
        margin-bottom: 6px;
        color: #666;
        font-weight: 500;
    }
    .picker {
        width: 80px;
        height: 36px;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        cursor: pointer;
        background: none;
    }
}
.preview {
    width: 100%;
    height: 200px;
    border-radius: 6px;
    border: 1px solid #eee;
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05);
}
.preview-text {
    margin-top: 10px;
    text-align: center;
    font-family: monospace;
    font-size: 16px;
}
.tool-status.error {
    color: #f5222d;
}
</style>
