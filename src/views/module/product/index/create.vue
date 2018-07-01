<style lang="less">
    @import "../../../../styles/common.less";
    .product-box {

        .product-description {
            margin-top: 20px;
        }
        h3 {
            margin-bottom: 10px;
        }
        .sku-change-line {
            width: 43px;
            height: 10px;
        }
    }
    .demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
</style>
<template>
    <div class="product-box">
        <Row>
            <Col span="8">
                <Card>
                    <h3>商品信息</h3>
                    <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                        <FormItem label="商品名称" prop="title">
                            <Input v-model="formValidate.title" placeholder="商品名称"></Input>
                        </FormItem>

                        <FormItem label="分类" prop="category">
                            <Select class="product-category" @on-change="querySubCategories"
                                    v-model="formValidate.category" placeholder="商品分类">
                                <Option value="0">未选择</Option>
                                <Option v-for="(item, index) in categories" :value="item.id">{{item.name}}</Option>
                            </Select>
                            <Select class="product-category" @on-change="changeSubCategory"
                                    v-model="formValidate.sub_category" placeholder="商品子分类">
                                <Option value="0">未选择</Option>
                                <Option v-for="(item, index) in subCategories" :value="item.id">{{item.name}}</Option>
                            </Select>
                            <div>
                                <span>
                                    <router-link to="/product/category/create-update">
                                        <Icon type="help-circled"></Icon> 去添加分类？</router-link>
                                </span>
                            </div>
                        </FormItem>
                        <FormItem label="价格" prop="price">
                            <Input v-model="formValidate.price" placeholder="商品价格"></Input>
                        </FormItem>
                        <FormItem label="排序" prop="sort">
                            <Input v-model="formValidate.sort" placeholder="排序"></Input>
                        </FormItem>
                        <FormItem label="是否上架" prop="status">
                            <RadioGroup v-model="formValidate.status">
                                <Radio label="0">下架</Radio>
                                <Radio label="1">上架</Radio>
                            </RadioGroup>
                        </FormItem>
                        <FormItem label="快递方式" prop="express_type">
                            <CheckboxGroup v-model="formValidate.express_type">
                                <Checkbox label="不支持混寄"></Checkbox>
                                <Checkbox label="支持混寄"></Checkbox>
                                <Checkbox label="门店自取"></Checkbox>
                                <Checkbox label="墨尔本同城派送"></Checkbox>
                            </CheckboxGroup>
                        </FormItem>
                        <FormItem label="商品简介" prop="summary">
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
            <Col span="16" class="padding-left-10">
                <Card>
                    <h3>商品属性（Sku）</h3>
                    <Form ref="formValidate" :model="formValidate">
                        <FormItem
                                v-for="(item, index) in formValidate.items"
                                v-if="item.status"
                                :key="index"
                                :label="'Sku ' + item.index"
                                :prop="'items.' + index + '.value'"
                                :rules="skuRuleValidate">
                            <Row>
                                <Col span="5">
                                    <Select v-model="item.attr_value_id">
                                        <OptionGroup v-for="attrName in attrNames" :label="attrName.name">
                                            <Option v-for="obj in attrName.attr_values" :value="obj.id" :key="obj.name">{{ obj.name }} {{ attrName.unit}}</Option>
                                        </OptionGroup>
                                    </Select>
                                </Col>
                                <Col span="4" class="padding-left-5">
                                    <Input type="text" v-model="item.stock" placeholder="请输入库存"></Input>
                                </Col>
                                <Col span="4" class="padding-left-5">
                                    <Input type="text" v-model="item.sale" placeholder="请输入销量"></Input>
                                </Col>
                                <Col span="4" class="padding-left-5">
                                    <Input type="text" v-model="item.price" placeholder="请输入价格"></Input>
                                </Col>
                                <Col span="4" class="padding-left-5">
                                    <Input type="text" v-model="item.vip_amount" placeholder="请输入VIP价格"></Input>
                                </Col>
                                <Col span="4" class="sku-change-line">

                                </Col>
                                <Col span="5">
                                    <Input type="text" v-model="item.discount" placeholder="请输入优惠"></Input>
                                </Col>
                                <Col span="3" class="padding-left-5">
                                    <Button type="ghost" @click="handleRemove(index)">删除</Button>
                                </Col>
                            </Row>
                        </FormItem>
                        <FormItem>
                            <Row>
                                <Col span="12">
                                    <Button type="dashed" long @click="handleAdd" icon="plus-round">添加Sku</Button>
                                </Col>
                            </Row>
                        </FormItem>
                    </Form>
                </Card>
            </Col>
        </Row>

        <Row>
            <Col span="24">
                <Card class="product-description">
                    <h3>商品图片</h3>
                    <div class="demo-upload-list" v-for="item in uploadList">
                        <template v-if="item.status === 'finished'">
                            <img :src="item.url">
                            <div class="demo-upload-list-cover">
                                <Icon type="ios-eye-outline" @click.native="handleView(item.url, item.name)"></Icon>
                                <Icon type="ios-trash-outline" @click.native="handleImageRemove(item)"></Icon>
                            </div>
                        </template>
                        <template v-else>
                            <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                        </template>
                    </div>
                    <Upload ref="upload"
                            name="image"
                            :show-upload-list="false"
                            :default-file-list="defaultList"
                            :on-success="handleSuccess"
                            :format="['jpg','jpeg','png']"
                            :max-size="2048"
                            :on-format-error="handleFormatError"
                            :on-exceeded-size="handleMaxSize"
                            :before-upload="handleBeforeUpload"
                            multiple
                            type="drag"
                            action="https://xcx.sourcedev.cc/admin/upload/image"
                            style="display: inline-block;width:58px;">
                        <div style="width: 58px;height:58px;line-height: 58px;">
                            <Icon type="camera" size="20"></Icon>
                        </div>
                    </Upload>
                    <Modal title="View Image" v-model="visible">
                        <img :src="showImage" v-if="visible" style="width: 100%">
                    </Modal>
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
    import skuRuleValidate from '@/validate/product';
    export default {
        components: {
            UEditor
        },
        data () {
            return {
                index: 1,
                primaryId: 0,
                attrNames: [],
                attrValues: [],
                formValidate: {
                    title: '',
                    category: '',
                    sub_category: '',
                    sort: '',
                    status: '',
                    description: '',
                    amount: 0,
                    express_type: [],
                    images: [],
                    items: [
                        {
                            index: 1,
                            attr_value_id: '',
                            attr_id: '',
                            status: 1,
                            sale: '',
                            price: '',
                            stock: '',
                            vip_amount: '',
                            discount: ''
                        }
                    ]
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
                    title: [
                        { required: true, message: 'The name cannot be empty', trigger: 'blur' }
                    ]
                },
                skuRuleValidate: skuRuleValidate,
                showImage: '',
                visible: false,
                defaultList: [],
                uploadList: []
            };
        },
        methods: {
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if (this.primaryId > 0) {
                            //
                        } else {
                            this.$axios.post('/admin/products', this.formValidate).then((res) => {
                                this.$Message.success('Success!');
                            }).catch((res) => {
                                //
                            });
                        }
                    } else {
                        this.$Message.error('Fail!');
                    }
                });
            },
            handleReset (name) {
                this.$refs[name].resetFields();
            },
            handleAdd () {
                this.index++;
                this.formValidate.items.push({
                    value: '',
                    index: this.index,
                    status: 1,
                    stock: '',
                    price: '',
                    sale: ''
                });
            },
            handleRemove (index) {
                delete this.formValidate.items[index];
                //this.formValidate.items[index].status = 0;
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
            getAttrNames (category, subCategory) {
                let query = {
                    category: category,
                    sub_category: subCategory
                }
                this.$axios.get('/admin/product/attr', {params: query}).then((res) => {
                    this.attrNames = res.data;
                });
            },
            changeSubCategory () {
                this.getAttrNames(this.formValidate.category, this.formValidate.sub_category);
            },
            handleSuccess (res, file) {
                file.url = res.src;
                file.name = res.filename;
                this.formValidate.images.push(res.src);
            },
            handleFormatError (file) {
                this.$Notice.warning({
                    title: 'The file format is incorrect',
                    desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
                });
            },
            handleMaxSize (file) {
                this.$Notice.warning({
                    title: 'Exceeding file size limit',
                    desc: 'File  ' + file.name + ' is too large, no more than 2M.'
                });
            },
            handleView (imageUrl, name) {
                this.showImage = imageUrl;
                this.visible = true;
            },
            handleBeforeUpload () {
                const check = this.formValidate.images.length < 5;
                if (!check) {
                    this.$Notice.warning({
                        title: 'Up to five pictures can be uploaded.'
                    });
                }
                return check;
            },
            handleImageRemove (file) {
                console.log(file)
                const fileList = this.$refs.upload.fileList;
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
                this.formValidate.images.splice(fileList.indexOf(file), 1);
            }
        },
        mounted () {
            this.uploadList = this.$refs.upload.fileList;
        },
        created () {
            this.queryAllParentCategory(0);
        }
    };
</script>
