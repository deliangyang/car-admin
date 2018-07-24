<style lang="less">

</style>
<template>
    <div>
        <Card>
            <p slot="title">系统公告</p>
            <Form ref="sysNotice" :model="sysNotice" :rules="ruleValidate" :label-width="80">
                <Row>
                    <Col span="12">
                        <FormItem label="标题" prop="title">
                            <Input v-model="sysNotice.title" type="text" placeholder="标题"></Input>
                        </FormItem>
                        <FormItem label="内容" prop="content">
                            <Input v-model="sysNotice.content" type="textarea" :autosize="{minRows: 5,maxRows: 10}" placeholder="内容"></Input>
                        </FormItem>

                        <!-- <FormItem label="类型">
                            <Select v-model="sysNotice.type" style="width:200px" :disabled="!!primaryId">
                                <Option :value="1">文字</Option>
                                <Option :value="2">图文</Option>
                                <Option :value="3">视频分享</Option>
                            </Select>
                        </FormItem> -->

                        <FormItem label="状态">
                            <Select v-model="sysNotice.status" style="width:200px">
                                <Option :value="0">禁用</Option>
                                <Option :value="1">启用</Option>
                            </Select>
                        </FormItem>

                        <FormItem>
                            <Button type="primary" v-on:click="handleSubmit('sysNotice')">保存</Button>
                            <Button type="ghost" style="margin-left: 8px">取消</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        </Card>
    </div>
</template>
<script>
export default {
    data () {
        return {
            primaryId: 0,
            sysNotice: {},
            ruleValidate: {
                title: [
                    { required: true, message: '标题不能为空', trigger: 'blur' }
                ],
                content: [
                    { required: true, message: '内容不能为空', trigger: 'blur' }
                ]
            }
        }
    },
    created () {
        let query = this.$route.query
        this.primaryId = query.id ? query.id : 0
    },
    methods: {
        loadSysNotice (id) {
            this.$axios.get('/admin/system/notice/' + id).then((res) => {
                this.sysNotice = res.data
            }).catch((res) => {

            })
        },
        handleSubmit (name) {
            console.log(name)
            this.$refs[name].validate((valid) => {
                console.log(valid)
                if (valid) {
                    if (this.primaryId > 0) {
                        this.updataSysNotice(this.primaryId, this.sysNotice)                        
                    } else {
                        this.addSysNotice(this.sysNotice)
                    }
                } else {
                    this.$Message.error('验证失败')
                }
            })
        },
        addSysNotice(data) {
            console.log(data)
            this.$axios.post('/admin/system/notice', data).then((res) => {
                this.$Message.success('添加成功')
                this.$router.push({
                    path: '/common/system/notice'
                })
            }).catch((res) => {
                this.$Message.error(res.message)
            })
        },

        updataSysNotice(id, data) {
            this.$axios.put('/admin/system/notice/' + id, data).then((res) => {
                this.$Message.success('编辑成功')
                this.$router.push({
                    path: '/common/system/notice'
                })
            }).catch((res) => {
                this.$Message.error(res.message)
            })
        }
    },

    mounted () {
        if (this.primaryId) {
            this.loadSysNotice(this.primaryId)
        }
    }
}
</script>
