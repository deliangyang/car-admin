<template>
    <script :id="id" type="text/plain"></script>
    </template>
    <script>
    import '@/styles/ueditor/ueditor.config.js';
    import '@/styles/ueditor/ueditor.all.min.js';
    import '@/styles/ueditor/lang/zh-cn/zh-cn.js';

    export default {
        name: 'UEditor',
        data () {
            return {
                editor: null
            }
        },
        props: {
            content: {
                type: String,
                default: ''
            },
            config: {
                type: Object,
            },
            id: {
                type: String
            }
        },
        created() {
            const _this = this;
            _this.editor = UE.getEditor(_this.id, _this.config); // 初始化UE
            _this.editor.addListener("ready", function () {
                _this.editor.setContent(_this.content); // 确保UE加载完成后，放入内容。
            });
            console.log(this.content)
        },
        methods: {
            getContent() { // 获取内容方法
                return this.editor.getContent();
            }
        },
        destroyed() {
            this.editor.destroy();
        },
    }
    </script>
