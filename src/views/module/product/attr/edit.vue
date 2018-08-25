<template>
    <div class="product-attr-box">
        <Row>
            <Col span="11">
                <Card>
                    <p slot="title">商品属性</p>
                    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                        <FormItem label="名称" prop="name">
                            <Input v-model="formValidate.name" placeholder="请输商品属性名称"></Input>
                        </FormItem>
                        <FormItem label="单位" prop="unit">
                            <Input v-model="formValidate.unit" placeholder="请输商品属性单位"></Input>
                        </FormItem>
                        <FormItem label="商品分类" prop="category">
                            <Select class="product-category" @on-change="querySubCategories" v-model="formValidate.category" placeholder="Select your category">
                                <Option value="0">未选择</Option>
                                <Option v-for="(item, index) in categories" :key="index" :value="item.id">{{item.name}}</Option>
                            </Select>
                            <Select class="product-category" v-model="formValidate.sub_category" placeholder="Select your category">
                                <Option value="0">未选择</Option>
                                <Option v-for="(item, index) in subCategories" :key="index" :value="item.id">{{item.name}}</Option>
                            </Select>
                            <div>
                                <div>
                                    <router-link to="/product/category/create-update"><Icon type="help-circled"></Icon> 去添加分类？</router-link>
                                </div>
                                <div>
                                    <Icon type="information-circled"></Icon> 未设置商品分类表示所有的商品都有可能具备该属性
                                </div>
                            </div>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" v-on:click="handleSubmit('formValidate')">保存</Button>
                            <Button type="ghost" style="margin-left: 8px">取消</Button>
                        </FormItem>
                    </Form>
                </Card>
            </Col>

            <Col span="11" offset="1">
                <Card>
                    <p slot="title">添加属性值</p>
                    <Form ref="formValidateAttrValues" :model="formValidate" :label-width="80">
                        <FormItem
                                v-for="(item, index) in formValidate.items"
                                v-if="item.status"
                                :key="index"
                                :label="'属性 ' + item.index"
                                :prop="'items.' + index + '.name'"
                                :rules="{required: true, message: '属性 ' + item.index +' 不能为空', trigger: 'blur'}">
                            <Row>
                                <Col span="18">
                                    <Input type="text" v-model="item.name" placeholder="请输入属性值..."></Input>
                                </Col>
                                <Col v-if="!primaryId" span="4" offset="1">
                                    <Button type="ghost" @click="handleRemove(index)">移除</Button>
                                </Col>
                            </Row>
                        </FormItem>
                        <FormItem>
                            <Row>
                                <Col span="12">
                                    <Button type="dashed" long @click="handleAdd" icon="plus-round">添加属性</Button>
                                </Col>
                            </Row>
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
                index: 1,
                parentCategory: [],
                formValidate: {
                    name: '',
                    category: 0,
                    unit: '',
                    sub_category: 0,
                    items: [
                        {
                            attr_id: 0,
                            name: '',
                            index: 1,
                            status: 1
                        }
                    ]
                },
                ruleValidate: {
                    name: [
                        { required: true, message: '属性名称不能为空', trigger: 'blur' }
                    ],
                    unit: [
                        { required: true, message: '属性单位不能为空', trigger: 'blur' }
                    ]
                },
                categories: [],
                subCategories: []
            };
        },
        methods: {
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let data = this.formValidate;
                        if (this.primaryId > 0) {
                            this.$axios.put('/admin/product/attr/' + this.primaryId, data).then((res) => {
                                if (res.statusCode === 200) {
                                    this.$Message.success('Success!');
                                }
                            });
                        } else {
                            this.$axios.post('/admin/product/attr', data).then((res) => {
                                if (res.statusCode === 200) {
                                    this.$Message.success('Success!');
                                }
                            });
                        }
                        setTimeout(() => {
                            this.$router.push({
                                path: '/product/attr/list'
                            })
                        }, 1000);
                    } else {
                        this.$Message.error('Fail!');
                    }
                });
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            },
            queryAllParentCategory (pid) {
                let query = {
                    pid: pid
                };
                this.$axios.get('/admin/product/category', {params: query}).then((res) => {
                    if (pid === 0) {
                        this.categories = res.data.data;
                    } else {
                        this.subCategories = res.data.data;
                    }
                });
            },
            querySubCategories (pid) {
                this.queryAllParentCategory(pid);
            },
            handleAdd () {
                this.index++;
                this.formValidate.items.push({
                    name: '',
                    index: this.index,
                    status: 1
                });
            },
            handleRemove (index) {
                this.formValidate.items[index].status = 0;
            }
        },
        created () {
            this.queryAllParentCategory(0);
            let query = this.$route.query
            if (query.id) {
                this.$axios.get('/admin/product/attr/' + query.id).then((res) => {
                    let attrs = res.data;
                    this.formValidate.name = attrs.name;
                    this.formValidate.unit = attrs.unit;
                    this.formValidate.category = attrs.category;
                    this.formValidate.sub_category = attrs.sub_category;
                    let temp;
                    this.formValidate.items = [];
                    for (let item in attrs.attr_values) {
                        temp = attrs.attr_values[item];
                        temp.index = this.index;
                        temp.status = 1;
                        this.formValidate.items.push(temp)
                        this.index++;
                    }
                    this.primaryId = query.id;
                }).catch((res) => {
                    this.$Message.error('商品不存在');
                    this.$router.push({
                        path: '/product/attr/create-update'
                    });
                });
            }
        }
    };
</script>

<style lang="less">
    .product-attr-box {
        .add-category-help {
            margin-left: 20px;
        }
        .product-category {
            width: 150px;
        }
        .product-description {
            margin-top: 20px;
        }
        h3 {
            margin-bottom: 10px;
        }
    }
</style>
