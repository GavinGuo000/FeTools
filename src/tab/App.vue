<template>
    <div class="mock-wrap">
        <nav class="mock-top">
            <a-button type="primary" @click="showModal" class="btn-wrap">
                <a-icon type="plus" /> 新建Mock数据
            </a-button>
            <a-button type="danger" @click="deleteData" class="btn-wrap">
                <a-icon type="delete" /> 清除数据
            </a-button>
            <a-button type="info" @click="closeAll" class="btn-wrap">
                <a-icon type="disconnect" /> 关闭所有数据
            </a-button>
            <a-button type="primary" @click="openAll" class="btn-wrap">
                <a-icon type="bug" /> 开启所有数据
            </a-button>
        </nav>
        <section>
            <a-table :columns="columns" :data-source="listData">
                <span slot="customTitle">API名称</span>
                <span slot="url" slot-scope="url">{{url}}</span>
                <span slot="status" slot-scope="text, record">
                    <a-switch 
                        v-model="text"
                        checked-children="开"
                        un-checked-children="关"
                        default-checked
                        @change="switchStatus(record.key)"
                    />
                </span>
                <span slot="action" slot-scope="text, record">
                    <a href="javascript:;" @click="editItem(record.key)">编辑</a>
                    <a-divider type="vertical" />
                    <a-popconfirm placement="bottomRight" ok-text="确定" cancel-text="取消" @confirm="deleteItem(record.key)">
                        <template slot="title">
                            确认要删除此条数据吗？
                        </template>
                        <a href="javascript:;">删除</a>
                    </a-popconfirm> 
                </span>
            </a-table>
        </section>
        <a-modal v-model="visible" title="mock数据详情" okText="确定" cancelText="取消" @ok="handleOk" @cancel="handleCancel">
            <div class="mock-wrap-inline">
                <label>名称：</label>
                <a-input placeholder="mock名称" v-model="name" />
            </div>
            <div class="mock-wrap-inline">
                <label>URL：</label>
                <a-input placeholder="url" v-model="url" />
            </div>
            <div class="mock-wrap-inline">
                <label>YAPI：</label>
                <a-input placeholder="url" v-model="yapi" />
            </div>
            <div class="mock-wrap-inline">
                <label>自定义数据：</label>
                <vue-json-editor
                v-model="jsonbody"
                :mode="'code'"
                lang="zh"
                @json-change="onJsonChange">
                </vue-json-editor>
            </div>
            <p>注意1：yapi和自定义数据不可同时配置，yapi优先级高于自定义数据</p>
        </a-modal>
    </div>
</template>

<script>
import Vue from 'vue';
import vueJsonEditor from 'vue-json-editor';

Vue.component('vue-json-editor', vueJsonEditor);

export default {
    data() {
        return {
            key: 0,
            name: '',
            url: '',
            yapi: '',
            jsonbody: {},
            listData: [],
            visible: false,
            columns: [
                {
                    dataIndex: 'name',
                    key: 'name',
                    slots: {title: 'customTitle'},
                    scopedSlots: {customRender: 'name'}
                },
                {
                    dataIndex: 'url',
                    title: 'url名称',
                    key: 'url',
                    slots: {title: 'url'},
                    scopedSlots: {customRender: 'url'}
                },
                {
                    title: '状态',
                    key: 'status',
                    dataIndex: 'status',
                    scopedSlots: {customRender: 'status'}
                },
                {
                    title: '操作',
                    key: 'action',
                    scopedSlots: {customRender: 'action'}
                }
            ]
        };
    },
    mounted() {
        this.init();
    },
    methods: {
        init() {
            const me = this;
            chrome.storage.local.get(['listData'], result => {
                me.listData = result.listData || [];
            });
        },
        onJsonChange (value) {
            this.jsonbody = value;
        },
        showModal() {
            this.visible = true;
        },
        // 删除全部数据
        deleteData() {
            const me = this;

            this.$confirm({
                title: '确认要删除所有的数据吗?',
                content: '删除后将无法恢复',
                okText: '确定',
                cancelText: '取消',
                onOk() {
                    chrome.storage.local.clear(() => {
                        me.$message.success('清除mock数据成功！');
                    });
                    chrome.storage.local.get(['listData'], result => {
                        me.listData = result.listData || [];
                    });
                },
                onCancel() {}
            });
        },
        // 修改数据状态
        switchStatus(key) {
            const me = this;
            chrome.storage.local.get(['listData'], result => {
                const list = result.listData || [];
                list.forEach(item => {
                    if (item.key === key) {
                        item.status = !item.status;
                    }
                });
                me.listData = list;
                chrome.storage.local.set({
                    listData: list
                });
            });
        },
        // 编辑单条数据
        editItem(key) {
            this.visible = true;
            chrome.storage.local.get(['listData'], result => {
                const list = (result.listData || []).filter(item => {
                    return item.key === key;
                });
                this.key = list[0].key;
                this.name = list[0].name;
                this.url = list[0].url;
                this.jsonbody = JSON.parse(list[0].jsonbody);
                this.yapi = list[0].yapi;
            });
        },
        // 删除单条数据
        deleteItem(key) {
            const me = this;
            chrome.storage.local.get(['listData'], result => {
                const list = (result.listData || []).filter(item => {
                    return item.key !== key;
                });
                me.listData = list;
                chrome.storage.local.set({
                    listData: list
                }, () => {
                    me.$message.success('删除成功！');
                });
            });
        },
        // 关闭所有的状态
        closeAll() {
            const me = this;
            chrome.storage.local.get(['listData'], result => {
                const list = (result.listData || []).map(item => {
                    return {
                        ...item,
                        status: false
                    };
                });
                me.listData = list;
                chrome.storage.local.set({
                    listData: list
                });
            });
        },
        // 打开所有的状态
        openAll() {
            const me = this;
            chrome.storage.local.get(['listData'], result => {
                const list = (result.listData || []).map(item => {
                    return {
                        ...item,
                        status: true
                    };
                });
                me.listData = list;
                chrome.storage.local.set({
                    listData: list
                });
            });
        },
        // 重置数据
        reset() {
            this.name = '';
            this.url = '';
            this.jsonbody = {};
            this.yapi = '';
            this.key = 0;
        },
        // modal取消事件
        handleCancel() {
            this.reset();
        },
        // modal确定事件
        handleOk(e) {
            this.visible = false;
            const me = this;

            chrome.storage.local.get(['listData'], result => {
                me.listData = result.listData || [];
            });

            if (me.key) {
                me.listData.forEach(item => {
                    if (item.key === me.key) {
                        item.name = me.name;
                        item.url = me.url;
                        item.jsonbody = JSON.stringify(me.jsonbody);
                        item.yapi = me.yapi;
                    }
                });
                chrome.storage.local.set({
                    listData: me.listData
                }, () => {
                    me.$message.success('编辑mock成功！');
                    chrome.storage.local.get(['listData'], result => {
                        me.listData = result.listData || [];
                    });
                });
            }
            else {
                me.listData.push({
                    key: Math.random() * 10e16,
                    name: me.name,
                    url: me.url,
                    status: true,
                    jsonbody: JSON.stringify(me.jsonbody),
                    yapi: me.yapi || ''
                });
                chrome.storage.local.set({
                    listData: me.listData
                }, () => {
                    me.$message.success('添加mock成功！');
                    chrome.storage.local.get(['listData'], result => {
                        me.listData = result.listData || [];
                    });
                });
            }
            me.reset();
        }
    }
};
</script>

<style lang="scss" scoped>
.mock-wrap {
    nav {
        padding: 10px 20px;
        background: #233050;
        box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.4);
        .btn-wrap {
            margin-right: 10px;
        }
    }
}
.mock-wrap-inline {
    label {
        display: inline-block;
        padding: 8px 0 3px;
    }
}
.jsoneditor-poweredBy {
    display: none !important;;
}
.jsoneditor-modes {
    display: none !important;
}
</style>
