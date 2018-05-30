<template>
    <div>
        <UEditor :id="id" :content="content" :config="config"></UEditor>
    </div>
</template>
<script>
    import UEditor from '@/views/module/common/uEditor.vue'
    export default {
        components: {
            UEditor
        },
        data () {
            return {
                config: {
                    initialFrameWidth: '100%',
                    initialFrameHeight: 350,
                    wordCount: false,
                },
                content: 'asdfasdf',
                id: 'hello',
            }
        },
        methods: {

        }
    }
</script>
