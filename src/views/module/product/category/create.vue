<template>
    <div>
        <Card>
            <p slot="title">添加商品分类</p>
            <Row>
                <Col span="6">
                    <Form :model="formItem" :label-width="100">
                        <FormItem label="名称" prop="name">
                            <Input v-model.trim="formItem.name" placeholder="请输入类型名称"></Input>
                        </FormItem>
                        <FormItem label="父分类" prop="pid">
                            <Select v-model.number="formItem.pid">
                                <Option value=0>未选择</Option>
                                <Option v-for="(item, index) in parentCategory" :key="index" :value="item.id">{{item.name}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="排序">
                            <Input v-model="formItem.sort" placeholder="排序"></Input>
                        </FormItem>
                        <FormItem label="是否展示首页" prop="show_home_page">
                            <Select v-model="formItem.show_home_page">
                                <Option :value=0>否</Option>
                                <Option :value=1>是</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="状态" prop="status">
                            <Select v-model="formItem.status">
                                <Option :value=0>禁用</Option>
                                <Option :value=1>启用</Option>
                            </Select>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" v-on:click="addOrUpdateProductCategory">保存</Button>
                            <Button type="ghost" style="margin-left: 8px">取消</Button>
                        </FormItem>
                    </Form>
                </Col>
            </Row>
        </Card>
    </div>
</template>
<script>
    export default {
        props: {
            show_home_page: Number,
            sort: Number,
            status: Number,
            name: String,
        },
        data () {
            return {
                parentCategory: [],
                formItem: {
                    name: '',
                    pid: 0,
                    status: 0,
                    sort: 0,
                    show_home_page: 0,
                },
                primaryKey: 0
            };
        },
        created () {
            let query = this.$route.query;
            this.primaryKey = query.id
        },
        methods: {
            addOrUpdateProductCategory () {
                let query = this.$route.query
                if (query.id) {
                    this.$axios.put('/admin/product/category/' + query.id, this.formItem).then((res) => {
                        if (res.status === 200) {
                            this.$Message.success('修改成功');
                        }
                    });
                } else {
                    this.$axios.post('/admin/product/category', this.formItem).then((res) => {
                        this.$Message.success('添加成功');
                    });
                }
                setTimeout(() => {
                    this.$router.push({
                        path: '/product/category/list'
                    })
                }, 1000);
            },
            loadCategory() {
                if (this.primaryKey > 0) {
                    this.$axios.get('/admin/product/category/' + this.primaryKey).then((res) => {
                        this.formItem = res.data;
                    });
                }
            }
        },
        mounted () {
            let params = {
                params: {
                    pid: 0
                }
            };
            this.$nextTick((res) => {
                this.$axios.get('/admin/product/category', params).then((res) => {
                    this.parentCategory = res.data.data;
                    this.loadCategory()
                });
            })
        },
        destroyed () {

        }
    };
</script>

<style>
</style>
