<style lang="less">

</style>
<template>
    <div>
        <Card>
            <p slot="title">更新优惠券</p>
            <Form ref="coupon" :model="coupon" :rules="ruleValidate" :label-width="80">
                <Row>
                    <Col span="12">
                        <FormItem label="名称" prop="name">
                            <Input v-model="coupon.name" placeholder="名称"></Input>
                        </FormItem>

                        <FormItem label="描述" prop="description">
                            <Input v-model="coupon.description" placeholder="描述"></Input>
                        </FormItem>

                       <FormItem label="满多少减" prop="fill_up">
                            <Input v-model="coupon.fill_up" placeholder="满多少减"></Input>
                        </FormItem>

                        <FormItem label="优惠" prop="discount">
                            <Input v-model="coupon.discount" placeholder="优惠"></Input>
                        </FormItem>

                        <FormItem label="有效期">
                            <DatePicker type="datetimerange" format="yyyy-MM-dd HH:mm" @on-change="changeQueryOrderTimeRange"
                            placeholder="请输入开始时间和结束时间" style="width:100%;"></DatePicker>
                        </FormItem>
                       
                        <FormItem>
                            <Button type="primary" @click="handleSubmit('coupon')">保存</Button>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="总数" prop="count">
                            <Input v-model="coupon.count" placeholder="总数"></Input>
                        </FormItem>

                        <FormItem label="库存" prop="stock">
                            <Input v-model="coupon.stock" placeholder="库存"></Input>
                        </FormItem>

                        <FormItem label="新人专享" prop="for_newer">
                            <Checkbox v-model="coupon.for_newer"></Checkbox>
                        </FormItem>

                        <FormItem label="适用商品" prop="products">
                            <Select v-model="coupon.products" type="multiple">

                            </Select>
                        </FormItem>

                        <FormItem label="适用分类" prop="category_scope">
                            <Select v-model="coupon.category_scope">
                                
                            </Select>
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
            couponId: 0,
            coupon: {},
            ruleValidate: {
                name: [
                    { required: true, message: '名称不能为空', trigger: 'blur' }
                ],
                description: [
                    { required: true, message: '描述不能为空', trigger: 'blur' }
                ],
                fill_up: [
                    { required: true, message: '满减金额不能为空', trigger: 'blur' }
                ],
                discount: [
                    { required: true, message: '优惠金额不能为空', trigger: 'blur' }
                ],
                count: [
                    { required: true, message: '总数不能为空', trigger: 'blur' }
                ],
                stock: [
                    { required: true, message: '库存不能为空', trigger: 'blur' }
                ],
            },
        }
    },
    methods: {
        handleSubmit (name) {
            this.$refs[name].validate((valid) => {
                console.log(this.coupon)
                if (valid) {
                     if (this.couponId > 0) {
                        this.$axios.put('/admin/coupon/config/' + this.couponId, this.coupon).then((res) => {
                            this.$Message.success('修改成功');
                            this.$router.push({
                                path: '/coupon/list'
                            })
                        }).catch((res) => {
                            console.log(1)
                            this.$Message.error(res.message);
                        })
                    } else {
                        this.$axios.post('/admin/coupon', this.coupon).then((res) => {
                            this.$Message.success('添加成功');
                            this.$router.push({
                                path: '/coupon/list'
                            })
                        })
                    }
                } else {
                    this.$Message.error('验证失败');
                }
            })
        },
        loadcoupon (id) {
            this.$axios.get('/admin/coupon/config/' + id).then((res) => {
                this.coupon = res.data
            })
        },
        changeQueryOrderTimeRange (res) {
            console.log(res)
            this.coupon.start_at = res[0]
            this.coupon.expirt_at = res[1]
        }
    },
    created () {
        let query = this.$route.query
        this.couponId = query.id
        this.loadcoupon(this.couponId)
    }
}
</script>
