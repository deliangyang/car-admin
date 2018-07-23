<style lang="less">

</style>
<template>
    <div class="product-attr-box">
        <Card>
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                <Row>
                    <Col span="12">
                        <FormItem label="标题">
                            <Input v-model="formValidate.title" readonly placeholder="标题"></Input>
                        </FormItem>

                        <FormItem label="联系方式">
                            <Input v-model="formValidate.contact" readonly placeholder="联系方式"></Input>
                        </FormItem>

                        <FormItem label="图片">
                            <img :src="formValidate.image" height="120px" alt="">
                        </FormItem>

                        <FormItem label="回复" prop="remark">
                            <Input v-model="formValidate.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                                    placeholder="回复"></Input>
                        </FormItem>
                        
                        <FormItem>
                            <Button type="primary" v-on:click="handleSubmit('formValidate')">保存</Button>
                            <Button type="ghost" style="margin-left: 8px">取消</Button>
                        </FormItem>
                    </Col>
                    <Col span="12">
                        <FormItem label="链接">
                            <Input v-model="formValidate.url" readonly placeholder="链接"></Input>
                        </FormItem>

                        <FormItem label="正文">
                            <Input v-model="formValidate.content" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                                    placeholder="内容"></Input>
                        </FormItem>

                    </Col>
                </Row>
            </Form>
        </Card>
    </div>
</template>
<script>
    export default {
        name: 'create',
        data () {
            return {
                primaryId: 0,
                index: 1,
                formValidate: {
                    remark: '',
                    content: '',
                    title: '',
                    contact: '',
                    url: ''
                },
                ruleValidate: {
                    remark: [
                        { required: true, message: '回复内容不能为空', trigger: 'blur' }
                    ]
                },
            };
        },
        methods: {
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let data = {
                            remark: this.formValidate.remark
                        }
                        if (this.primaryId > 0) {
                            this.$axios.put('/admin/feedback/' + this.primaryId, data).then((res) => {
                                if (res.statusCode === 200) {
                                    this.$Message.success('Success!');
                                }
                            });
                        } else {
                           
                        }
                        this.$Message.success('回复成功');
                        this.$router.push({
                            path: '/feedback/list'
                        })
                    } else {
                        this.$Message.error('Fail!');
                    }
                });
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            }
        },
        created () {
            let query = this.$route.query
            if (query.id) {
                this.$axios.get('/admin/feedback/' + query.id).then((res) => {
                    this.formValidate = res.data
                    this.primaryId = query.id;
                }).catch((res) => {
                    this.$Message.error('反馈不存在');
                    this.$router.push({
                        path: '/feedback/list'
                    });
                });
            }
        }
    };
</script>

<style>
</style>
