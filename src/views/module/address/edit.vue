<style lang="less">
   
</style>
<template>
    <div class="product-box">
        <Row>
            <Col span="24">
                <Card>
                    <Form ref="formValidate" :model="formValidate" :label-width="80">
                        <Row>
                            <Col span="12">
                                <FormItem label="用户编号" prop="user_id">
                                    <Input v-model="formValidate.user_id" readonly placeholder="用户编号"></Input>
                                </FormItem>
                                <FormItem label="省份" prop="province">
                                    <Select @on-change="changeProvince" :value="formValidate.province"
                                            v-model="formValidate.province" placeholder="省份">
                                        <Option value="0">未选择</Option>
                                        <Option v-for="(item, index) in province" v-key="index" :value="item.id">{{item.name}}</Option>
                                    </Select>
                                </FormItem>
                                <FormItem label="城市" prop="city">
                                    <Select @on-change="changeCity" :value="formValidate.city"
                                            v-model="formValidate.city" placeholder="城市">
                                        <Option value="0">未选择</Option>
                                        <Option v-for="(item, index) in city" v-key="index" :value="item.id">{{item.name}}</Option>
                                    </Select>
                                </FormItem>
                                <FormItem label="区县" prop="country">
                                    <Select v-model="formValidate.country" placeholder="区县" 
                                            :value="formValidate.country">
                                        <Option value="0">未选择</Option>
                                        <Option v-for="(item, index) in country" v-key="index" :value="item.id">{{item.name}}</Option>
                                    </Select>
                                </FormItem>
                                <FormItem label="地址" prop="detail">
                                    <Input v-model="formValidate.detail" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                                           placeholder="请输入详细地址"></Input>
                                </FormItem>
                            </Col>
                        </Row>
                        <FormItem>
                            <Button type="primary" @click="handleSubmit('formValidate')">更新</Button>
                        </FormItem>
                    </Form>
                </Card>
            </Col>
        </Row>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                primaryId: 0,
                formValidate: {
                    user_id: '',
                    province: '',
                    city: '',
                    country: '',
                    detail: '',
                },
                province: [],
                city: [],
                country: []
            };
        },
        methods: {
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let data = this.formValidate
                        this.$axios.put('/admin/address/' + this.primaryId, data).then((res) => {
                            this.$Message.success('成功修改地址')
                            this.$router.push({
                                path: '/address/list'
                            })
                        })
                    } else {
                        this.$Message.error('Fail!');
                    }
                });
            },
            loadProvince() {
                this.$axios.get('/location').then((res) => {
                    this.province = res.data
                })
            },
            changeProvince(province) {
                let params = {
                    province: province
                }
                this.$axios.get('/location', {params: params}).then((res) => {
                    this.city = res.data
                    // this.country = []
                    // this.formValidate.city = 0
                    // this.formValidate.country = 0
                })
            },
            changeCity(city) {
                let params = {
                    province: this.province,
                    city: city
                }
                this.$axios.get('/location', {params: params}).then((res) => {
                    this.country = res.data
                    //this.formValidate.country = 0
                })
            }
        },
        created () {
            let query = this.$route.query
            if (query.id) {
                this.primaryId = query.id
                this.loadProvince()
                this.$axios.get('/admin/address/' + query.id).then((res) => {
                    this.formValidate = res.data
                    // if (this.formValidate.province) {
                    //     this.changeProvince(this.formValidate.province)
                    //     if (this.formValidate.city) {
                    //         this.changeCity(this.formValidate.city)
                    //     }
                    // }
                }).catch((res) => {
                    this.$Message.error('地址信息加载失败')
                });
            }
        },
        mounted() {
            this.$refs.formValidate.province = this.formValidate.province
        }
    };
</script>
