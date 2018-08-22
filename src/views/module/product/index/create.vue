<template>
    <div class="product-box">
        <Row>
            <Col span="24">
            <Card>
                <p slot="title">商品信息</p>
                <a href="#/product/index/list" slot="extra">
                    <Icon type="chevron-left"></Icon>
                    返回商品列表页
                </a>
                <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="100">
                    <Row>
                        <Col span="12">
                            <FormItem label="商品名称" prop="title">
                                <Input v-model="formValidate.title" placeholder="商品名称"></Input>
                            </FormItem>

                            <FormItem label="分类" prop="category">
                                <Select class="product-category" @on-change="querySubCategories" v-model="formValidate.category" placeholder="商品分类">
                                    <Option value="0">未选择</Option>
                                    <Option v-for="(item, key) in categories" :key="key" :value="item.id">{{item.name}}</Option>
                                </Select>
                                <Select class="product-category" @on-change="changeSubCategory" v-model="formValidate.sub_category" placeholder="商品子分类">
                                    <Option value="0">未选择</Option>
                                    <Option v-for="(item, key) in subCategories" :key="key" :value="item.id">{{item.name}}</Option>
                                </Select>
                                <div>
                                    <span>
                                        <router-link to="/product/category/create-update">
                                            <Icon type="help-circled"></Icon> 去添加分类？
                                        </router-link>
                                    </span>
                                </div>
                            </FormItem>
                           
                            <FormItem label="封面缩略图">
                                <div class="demo-upload-list" v-for="(item, key) in defaultProductCoverImage" :key="key">
                                    <template v-if="item.status === 'finished'">
                                        <img :src="item.url">
                                        <div class="demo-upload-list-cover">
                                            <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                                            <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                                        </div>
                                    </template>
                                    <template v-else>
                                        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                                    </template>
                                </div>
                                <Upload
                                    ref="cover"
                                    name="image"
                                    :show-upload-list="false"
                                    :default-file-list="defaultProductCoverImage"
                                    :on-success="uploadProductCoverImageSuccess"
                                    :format="['jpg','jpeg','png']"
                                    :max-size="2048"
                                    :on-format-error="handleFormatError"
                                    :on-exceeded-size="handleMaxSize"
                                    multiple
                                    type="drag"
                                    :action="uploadImageUrl"
                                    style="display: inline-block;width:58px;">
                                    <div style="width: 58px;height:58px;line-height: 58px;">
                                        <Icon type="ios-camera" size="20"></Icon>
                                    </div>
                                </Upload>
                                <Modal title="封面缩略图" v-model="visible">
                                    <img :src="product.cover" v-if="visible" style="width: 100%">
                                </Modal>
                            </FormItem>

                            <FormItem label="排序" prop="sort">
                                <Input v-model="formValidate.sort" placeholder="排序"></Input>
                            </FormItem>
                            <FormItem label="标签" prop="tag">
                                <Input v-model="formValidate.tag" placeholder="标签"></Input>
                            </FormItem>
                            <FormItem label="是否上架" prop="status">
                                <RadioGroup v-model="formValidate.status">
                                    <Radio label="0">下架</Radio>
                                    <Radio label="1">上架</Radio>
                                </RadioGroup>
                            </FormItem>
                            <FormItem label="热门商品" prop="is_hot">
                                <RadioGroup v-model="formValidate.is_hot">
                                    <Radio label="0">否</Radio>
                                    <Radio label="1">是</Radio>
                                </RadioGroup>
                            </FormItem>
                            <FormItem label="快递方式" prop="express_type">
                                <CheckboxGroup v-model="formValidate.express_type">
                                    <Checkbox value=1 label="不支持混寄"></Checkbox>
                                    <Checkbox value=2 label="支持混寄"></Checkbox>
                                    <Checkbox value=3 label="门店自取"></Checkbox>
                                    <Checkbox value=4 label="墨尔本同城派送"></Checkbox>
                                </CheckboxGroup>
                            </FormItem>

                            <FormItem label="商品简介" prop="summary">
                                <Input v-model="formValidate.summary" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                                    placeholder="商品简介"></Input>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem label="价格" prop="amount">
                                <Input v-model="formValidate.amount" placeholder="商品价格"></Input>
                            </FormItem>
                            <FormItem label="黄金会员价格" prop="gold_amount">
                                <Input v-model="formValidate.gold_amount" placeholder="黄金会员价格"></Input>
                            </FormItem>
                            <FormItem label="铂金会员价格" prop="platinum_amount">
                                <Input v-model="formValidate.platinum_amount" placeholder="铂金会员价格"></Input>
                            </FormItem>
                            <FormItem label="钻石会员价格" prop="diamond_amount">
                                <Input v-model="formValidate.diamond_amount" placeholder="钻石会员价格"></Input>
                            </FormItem>
                        </Col>
                    </Row>

                </Form>
            </Card>
            </Col>
        </Row>
        <Row>
            <Col span="24">
            <Card class="product-description">
                <p slot="title">商品属性（Sku）</p>
                <Form ref="skuItems" :model="skuItems" >
                    <Row>
                        <Col span="6" v-for="(item, index) in skuItems.items" :key="index" class="sku-item">
                            <FormItem v-if="item.status" :prop="'items.' + index + '.value'" :rules="skuRuleValidate">
                                <Card class="sku-item-box">
                                    <p slot="title">Sku-{{item.index}}</p>
                                    <p label="sku">
                                        <Select v-model="item.attr_value_id">
                                            <OptionGroup v-for="(attrName, index) in attrNames" 
                                                :key="index" :value="index" :label="attrName.name">
                                                <Option v-for="obj in attrName.attr_values" :value="obj.id" :key="obj.name">
                                                    {{ obj.name }} {{ attrName.unit}}
                                                </Option>
                                            </OptionGroup>
                                        </Select>
                                    </p>
                                    <p label="库存">
                                        <Input type="text" v-model="item.stock" placeholder="请输入库存"></Input>
                                    </p>
                                    <p label="销量">
                                        <Input type="text" v-model="item.sale" placeholder="请输入销量"></Input>
                                    </p>
                                    <p label="优惠">
                                        <Input type="text" v-model="item.discount" placeholder="请输入优惠"></Input>
                                    </p>
                                    <p label="价格">
                                        <Input type="text" v-model="item.amount" placeholder="请输入价格"></Input>
                                    </p>
                                    <p label="黄金会员价格">
                                        <Input type="text" v-model="item.gold_amount" placeholder="请输入黄金会员价格"></Input>
                                    </p>
                                    <p label="铂金会员价格">
                                        <Input type="text" v-model="item.platinum_amount" placeholder="请输入铂金会员价格"></Input>
                                    </p>
                                    <p label="砖石会员价格">
                                        <Input type="text" v-model="item.diamond_amount" placeholder="请输入砖石会员价格"></Input>
                                    </p>
                                    <p>
                                        <Button type="ghost" @click="handleRemove(index)">删除</Button>
                                    </p>
                                </Card>
                            </FormItem>
                        </Col>
                    </Row>

                    <FormItem>
                        <Row>
                            <Col span="8" offset="8">
                            <Button type="dashed" long @click="handleAdd()" icon="plus-round">添加Sku</Button>
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
                <p slot="title">商品图片</p>
                <div class="demo-upload-list" v-for="(item, index) in uploadList" :key="index">
                    <template v-if="item.status === 'finished'">
                        <img :src="item.url">
                        <div class="demo-upload-list-cover">
                            <Icon type="ios-eye-outline" @click.native="handleView(item.url, item.name)"></Icon>
                            <Icon type="ios-trash-outline" @click.native="handleImageRemove(item)"></Icon>
                        </div>
                    </template>
                    <template v-else>
                        <progress v-if="item.showProgress" :percent="item.percentage" hide-info></progress>
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
                        :action="uploadImageUrl"
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
                <p slot="title">商品描述</p>
                <UEditor v-model="formValidate.description"></UEditor>
                <Form>
                    <FormItem class="bottom-button">
                        <Button type="primary" @click="handleSubmit('formValidate')">Submit</Button>
                    </FormItem>
                </Form>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script>
    import UEditor from '@/views/module/common/uEditor.vue';
    import skuRuleValidate from '@/validate/product';
    import util from '@/libs/util';

    export default {
        components: {
            UEditor
        },
        props: {
            amount: Number,
            vip_amount: Number,
            gold_amount: Number
        },
        data() {
            return {
                uploadImageUrl: util.imageUploadUrl,
                index: 1,
                subCategory: 0,
                primaryId: 0,
                attrNames: [],
                attrValues: [],
                formValidate: {},
                defaultProductCoverImage: [],
                skuItems: {
                    items: [
                        {
                            index: 1,
                            attr_value_id: '',
                            attr_id: '',
                            status: 1,
                            sale: '',
                            amount: '',
                            stock: '',
                            vip_amount: '',
                            discount: ''
                        }
                    ]
                },
                config: {
                    initialFrameWidth: '100%',
                    initialFrameHeight: 700,
                    wordCount: false,
                    autoHeight: false
                },
                descriptionId: 'hello_ueditor',
                categories: [],
                subCategories: [],
                ruleValidate: {
                    title: [
                        {required: true, message: 'The name cannot be empty', trigger: 'blur'}
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
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if(valid) {
                        this.formValidate.items = this.skuItems.items;
                        if (this.primaryId > 0) {
                            this.$axios.put('/admin/products/' + this.primaryId, this.formValidate).then((res) => {
                                this.$Message.success('成功更新商品');
                            }).catch((res) => {
                                this.$Message.error('更新失败');
                            });
                        } else {
                            this.$axios.post('/admin/products', this.formValidate).then((res) => {
                                    this.$Message.success('Success!');
                                }).catch((res) => {
                                    this.$Message.error('添加商品失败');
                                });
                            }
                    } else {
                        this.$Message.error('Fail!');
                    }
                });
            },
            handleReset(name) {
                this.$refs[name].resetFields();
            },
            handleAdd() {
                this.skuItems.items.push({
                    index: this.index++,
                    status: 1,
                    attr_value_id: '',
                    attr_id: '',
                    sale: '',
                    amount: '',
                    stock: '',
                    vip_amount: '',
                    discount: ''
                });
            },
            handleRemove(index) {
                this.skuItems.items[index].status = 0;
                let skuId = this.skuItems.items[index].id;
                if (skuId > 0) {
                    this.$axios.delete('/admin/product/sku/' + skuId).then((res) => {
                        this.$Message.success('成功移除sku');
                    }).catch((res) => {
                        this.$Message.error('移除sku失败');
                    }) ;
                }
            },
            queryAllParentCategory(pid) {
                let query = {
                    pid: pid
                };
                this.$axios.get('/admin/product/category', {params: query}).then((res) => {
                    if (pid === 0) {
                        this.categories = res.data.data;
                    } else {
                        this.subCategories = res.data.data;
                        this.formValidate.sub_category = this.subCategory
                    }
                });
            },
            querySubCategories(pid) {
                this.queryAllParentCategory(pid);
            },
            getAttrNames(category, subCategory) {
                let query = {
                    // category: category,
                    // sub_category: subCategory
                };
                this.$axios.get('/admin/product/attr', {params: query}).then((res) => {
                    this.attrNames = res.data;
                });
            },
            changeSubCategory() {
                //this.getAttrNames(this.formValidate.category, this.formValidate.sub_category);
            },
            handleSuccess(res, file) {
                file.url = res.src;
                file.name = res.filename;
                this.formValidate.images.push({
                    id: 0,
                    src: res.src
                });
            },
            uploadProductCoverImageSuccess (res, file) {
                file.url = res.src;
                file.name = res.filename;
                this.defaultProductCoverImage.splice(0);
                this.defaultProductCoverImage.push({
                    name: res.filename,
                    url: res.src,
                    status: 'finished'
                })
                this.formValidate.cover = res.src
            },
            handleFormatError(file) {
                this.$Notice.warning({
                    title: 'The file format is incorrect',
                    desc: 'File format of ' + file.name + ' is incorrect, please select jpg or png.'
                });
            },
            handleMaxSize(file) {
                this.$Notice.warning({
                    title: 'Exceeding file size limit',
                    desc: 'File  ' + file.name + ' is too large, no more than 2M.'
                });
            },
            handleView(imageUrl, name) {
                this.showImage = imageUrl;
                this.visible = true;
            },
            handleBeforeUpload() {
                return true;
                // const check = this.formValidate.images.length < 5;
                // if (!check) {
                //     this.$Notice.warning({
                //         title: 'Up to five pictures can be uploaded.'
                //     });
                // }
                // return check;
            },
            handleImageRemove(file) {
                const fileList = this.$refs.upload.fileList;
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
                this.formValidate.images.splice(fileList.indexOf(file), 1);
                if (file.id > 0) {
                    this.$axios.delete('/admin/image/' + file.id).then((res) => {
                        this.$Message.success('删除成功');
                    }).catch((res) => {
                        this.$Message.error('删除失败');
                    });
                }
            },
            loadProduct() {
                this.$axios.get('/admin/products/' + this.primaryId).then((res) => {
                    this.subCategory = res.data.sub_category
                    res.data.sub_category = 0;
                    this.formValidate = res.data;
                    this.formValidate.status = this.formValidate.status + '';
                    this.formValidate.is_hot = this.formValidate.is_hot + '';
                    res.data.skus.forEach(element => {
                        element.amount = (element.amount / 100).toFixed(2)
                        element.evip_amount = (element.vip_amount / 100).toFixed(2)
                        element.gold_amount = (element.gold_amount / 100).toFixed(2)
                        element.diamond_amount = (element.diamond_amount / 100).toFixed(2)
                        element.platinum_amount = (element.platinum_amount / 100).toFixed(2)
                    });
                    let skus = res.data.skus;
                    let temp, item;
                    this.skuItems.items[0].status = 0;
                    this.formValidate.express_type = [];

                    this.formValidate.amount = (this.formValidate.amount / 100).toFixed(2)
                    this.formValidate.vip_amount = (this.formValidate.vip_amount / 100).toFixed(2)
                    this.formValidate.gold_amount = (this.formValidate.gold_amount / 100).toFixed(2)
                    this.formValidate.diamond_amount = (this.formValidate.diamond_amount / 100).toFixed(2)
                    this.formValidate.platinum_amount = (this.formValidate.platinum_amount / 100).toFixed(2)

                    if (this.formValidate.cover) {
                        this.defaultProductCoverImage.push({
                            name: '',
                            url: this.formValidate.cover,
                            status: 'finished'
                        })  
                    }

                    for (item in res.data.images) {
                        this.uploadList.push({
                            id: res.data.images[item].id,
                            entity_id: res.data.images[item].entity_id,
                            entity_type: res.data.images[item].entity_type,
                            url: res.data.images[item].src,
                            status: 'finished',
                            name: ''
                        });
                    }
                    for (item in skus) {
                        temp = skus[item];
                        temp.index = this.index++;
                        temp.status = 1;
                        this.skuItems.items.push(temp);
                    }
                }).catch((res) => {

                });
            }
        },
        mounted() {
            this.uploadList = this.$refs.upload.fileList;
            this.defaultProductCoverImage = this.$refs.cover.fileList
            this.queryAllParentCategory(0);
            if (this.primaryId > 0) {
                this.loadProduct()
            }
            this.$nextTick((res) => {
                this.queryAllParentCategory(this.formValidate.category);                
                this.getAttrNames()
            })
        },
        watch: {

        },
        created() {
            let query = this.$route.query
            this.primaryId = query.id
        }
    };
</script>

<style lang="less">
    .product-box {
        .product-description {
            margin-top: 10px;
        }
        .sku-change-line {
            width: 43px;
            height: 10px;
        }
        .bottom-button {
            margin-top: 20px;
        }
        .product-category {
            width: 200px;
        }
        .marin-left-33 {
            margin-left: 33px;
        }   
        .sku-item-box {
            margin: 10px;
        }
        .ivu-form-item {
            margin-bottom: 10px;
        }
    }

</style>