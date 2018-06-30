<style lang="less">
    .product-box {
        .product-category {
            width: 160px;
        }
        .product-description {
            margin-top: 20px;
        }
        h3 {
            margin-bottom: 10px;
        }
    }
</style>
<template>
    <div class="product-box">
        <Row>
            <Col span="12">
                <Card>
                    <h3>商品信息</h3>
                    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                        <FormItem label="商品名称" prop="title">
                            <Input v-model="formValidate.title" placeholder="Enter product title"></Input>
                        </FormItem>
                        <FormItem label="分类" prop="category">
                            <Select class="product-category" @on-change="querySubCategories"	 v-model="formValidate.category" placeholder="Select your category">
                                <Option value="0">未选择</Option>
                                <Option v-for="(item, index) in categories" :value="item.id">{{item.name}}</Option>
                            </Select>
                            <Select class="product-category" v-model="formValidate.subCategory" placeholder="Select your category">
                                <Option value="0">未选择</Option>
                                <Option v-for="(item, index) in subCategories" :value="item.id">{{item.name}}</Option>
                            </Select>
                            <span>
                                <router-link to="/product/category/create-update"><Icon type="help-circled"></Icon> 去添加分类？</router-link>
                            </span>
                        </FormItem>
                        <FormItem label="Date">
                            <Row>
                                <Col span="11">
                                    <FormItem prop="date">
                                        <DatePicker type="date" placeholder="Select date" v-model="formValidate.date"></DatePicker>
                                    </FormItem>
                                </Col>
                                <Col span="2" style="text-align: center">-</Col>
                                <Col span="11">
                                    <FormItem prop="time">
                                        <TimePicker type="time" placeholder="Select time" v-model="formValidate.time"></TimePicker>
                                    </FormItem>
                                </Col>
                            </Row>
                        </FormItem>
                        <FormItem label="Gender" prop="gender">
                            <RadioGroup v-model="formValidate.gender">
                                <Radio label="male">Male</Radio>
                                <Radio label="female">Female</Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem label="Hobby" prop="interest">
                            <CheckboxGroup v-model="formValidate.interest">
                                <Checkbox label="Eat"></Checkbox>
                                <Checkbox label="Sleep"></Checkbox>
                                <Checkbox label="Run"></Checkbox>
                                <Checkbox label="Movie"></Checkbox>
                            </CheckboxGroup>
                        </FormItem>
                        <FormItem label="Desc" prop="summary">
                            <Input v-model="formValidate.summary" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                                   placeholder="商品简介"></Input>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" @click="handleSubmit('formValidate')">Submit</Button>
                            <Button type="ghost" @click="handleReset('formValidate')" style="margin-left: 8px">Reset
                            </Button>
                        </FormItem>
                    </Form>
                </Card>
            </Col>
            <Col span="12">
                <Card>
                    <h3>商品属性</h3>
                </Card>
            </Col>
        </Row>

        <Row>
            <Col span="24">
                <Card class="product-description">
                    <h3>商品描述</h3>
                    <UEditor :id="descriptionId" :content="formValidate.description" :config="config"></UEditor>
                </Card>
            </Col>
        </Row>
    </div>
</template>
<script>
    import UEditor from '@/views/module/common/uEditor.vue';
    export default {
        components: {
            UEditor
        },
        data () {
            return {
                formValidate: {
                    title: '',
                    category: '',
                    subCategory: '',
                    city: '',
                    gender: '',
                    interest: [],
                    date: '',
                    time: '',
                    description: ''
                },
                config: {
                    initialFrameWidth: '100%',
                    initialFrameHeight: 350,
                    wordCount: false
                },
                descriptionId: 'hello',
                categories: [],
                subCategories: [],
                ruleValidate: {
                    name: [
                        {required: true, message: 'The name cannot be empty', trigger: 'blur'}
                    ],
                    mail: [
                        {required: true, message: 'Mailbox cannot be empty', trigger: 'blur'},
                        {type: 'email', message: 'Incorrect email format', trigger: 'blur'}
                    ],
                    city: [
                        {required: true, message: 'Please select the city', trigger: 'change'}
                    ],
                    gender: [
                        {required: true, message: 'Please select gender', trigger: 'change'}
                    ],
                    interest: [
                        {
                            required: true,
                            type: 'array',
                            min: 1,
                            message: 'Choose at least one hobby',
                            trigger: 'change'
                        },
                        {type: 'array', max: 2, message: 'Choose two hobbies at best', trigger: 'change'}
                    ],
                    date: [
                        {required: true, type: 'date', message: 'Please select the date', trigger: 'change'}
                    ],
                    time: [
                        {required: true, type: 'string', message: 'Please select time', trigger: 'change'}
                    ],
                    desc: [
                        {required: true, message: 'Please enter a personal introduction', trigger: 'blur'},
                        {type: 'string', min: 20, message: 'Introduce no less than 20 words', trigger: 'blur'}
                    ]
                }
            };
        },
        methods: {
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$Message.success('Success!');
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
            }
        },
        created () {
            this.queryAllParentCategory(0);
        }
    };
</script>
