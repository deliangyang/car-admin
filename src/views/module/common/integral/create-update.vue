<style lang="less">

</style>
<template>
    <div>
        <Card>
            <p slot="title">更新积分</p>
            <Form ref="integral" :model="integral" :rules="ruleValidate" :label-width="80">
                <Row>
                    <Col span="12">
                        <FormItem label="名称" prop="name">
                            <Input v-model="integral.name" placeholder="名称"></Input>
                        </FormItem>

                        <FormItem label="积分" prop="integral">
                            <Input v-model="integral.integral" placeholder="积分"></Input>
                        </FormItem>

                       <FormItem label="备注">
                            <Input v-model="integral.remarks" placeholder="备注"></Input>
                        </FormItem>
                       
                        <FormItem>
                            <Button type="primary" @click="handleSubmit('integral')">保存</Button>
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
            integralId: 0,
            integral: {},
            ruleValidate: {
                name: [
                    { required: true, message: '名称不能为空', trigger: 'blur' }
                ],
                // integral: [
                //     { required: true, message: '积分不能为空', trigger: 'blur' }
                // ],
            },
        }
    },
    methods: {
        handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                     if (this.integralId > 0) {
                        this.$axios.put('/admin/integral/config/' + this.integralId, this.integral).then((res) => {
                            this.$Message.success('修改成功');
                            this.$router.push({
                                path: '/common/integral/config'
                            })
                        }).catch((res) => {
                            console.log(1)
                            this.$Message.error(res.message);
                        })
                    } else {
                        this.$axios.post('/admin/integral/config', this.integral).then((res) => {
                            this.$Message.success('添加成功');
                            this.$router.push({
                                path: '/common/integral/config'
                            })
                        })
                    }
                } else {
                    this.$Message.error('验证失败');
                }
            })
        },
        loadintegral (id) {
            this.$axios.get('/admin/integral/config/' + id).then((res) => {
                this.integral = res.data
            })
        },
    },
    created () {
        let query = this.$route.query
        this.integralId = query.id
        this.loadintegral(this.integralId)
    }
}
</script>
