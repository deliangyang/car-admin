<style lang="less">

</style>
<template>
    <div>
        <Card>
            <p slot="title">更新快递信息</p>
            <Form ref="express" :model="express" :rules="ruleValidate" :label-width="80">
                <Row>
                    <Col span="12">
                        <FormItem label="名称" prop="title">
                            <Input v-model="express.title" placeholder="名称"></Input>
                        </FormItem>

                        <FormItem label="费用(AU$)" prop="amount">
                            <Input v-model="express.amount" placeholder="费用"></Input>
                        </FormItem>

                        <FormItem label="排序">
                            <Input v-model="express.sort" placeholder="排序"></Input>
                        </FormItem>

                        <FormItem label="描述">
                            <Input v-model="express.description" placeholder="描述"></Input>
                        </FormItem>

                        <FormItem>
                            <Button type="primary" @click="handleSubmit('express')">保存</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        </Card>
    </div>
</template>
<script>

import util from '@/libs/util';

export default {
    data () {
        return {
            expressId: 0,
            visible: false,
            express: {},
            ruleValidate: {
                title: [
                    { required: true, message: '标题不能为空', trigger: 'blur' }
                ],
                amount: [
                    { required: true, message: '费用不能为空', trigger: 'blur' }
                ],
            },
        }
    },
    methods: {
        handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    if (this.expressId > 0) {
                        this.$axios.put('/admin/express/' + this.expressId, this.express).then((res) => {
                            this.$Message.success('修改成功');
                            this.$router.push({
                                path: '/express/index'
                            })
                        }).catch((res) => {
                            console.log(1)
                            this.$Message.error(res.message);
                        })
                    } else {
                        this.$axios.post('/admin/express', this.express).then((res) => {
                            this.$Message.success('添加成功');
                            this.$router.push({
                                path: '/express/index'
                            })
                        })
                    }
                } else {
                    this.$Message.error('验证失败');
                }
            })
        },
        loadexpress (id) {
            this.$axios.get('/admin/express/' + id).then((res) => {
                this.express = res.data
                this.express.amount = (this.express.amount / 100).toFixed(2)
            })
        },
      
    },
    created () {
        let query = this.$route.query
        this.expressId = query.id
        this.loadexpress(this.expressId)
    },
    computed: {
        
    }
}
</script>
