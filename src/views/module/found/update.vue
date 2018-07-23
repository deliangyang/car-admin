<style lang="less">

</style>
<template>
    <div class="product-attr-box">
        <Card>
            <p slot="title">编辑发现</p>
            <Form ref="foundCircle" :model="foundCircle" :rules="ruleValidate" :label-width="80">
                <Row>
                    <Col span="12">
                        <FormItem label="内容">
                            <Input v-model="foundCircle.content" type="textarea" :autosize="{minRows: 5,maxRows: 10}" placeholder="内容"></Input>
                        </FormItem>

                        <FormItem label="类型">
                            <Select v-model="foundCircle.type" style="width:200px" :disabled="!!primaryId">
                                <Option :value="1">文字</Option>
                                <Option :value="2">图文</Option>
                                <Option :value="3">视频分享</Option>
                            </Select>
                        </FormItem>

                        <FormItem label="状态">
                            <Select v-model="foundCircle.status" style="width:200px">
                                <Option :value="0">禁用</Option>
                                <Option :value="1">启用</Option>
                            </Select>
                        </FormItem>

                        <FormItem label="图片或视频" v-if="this.foundCircle.type !== 1">
                            <div class="demo-upload-list" v-for="(item, index) in uploadList" :key="index">
                                <template v-if="item.status === 'finished'">
                                    <video v-if="item.type==='video'" :src="item.url" style="width:100%;height:100%"></video>
                                    <img v-else :src="item.url">
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
                                    :format="['jpg','jpeg','png', 'mp4']"
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
                            <Alert show-icon>请勿更换上传的媒体数据类型</Alert>
                        </FormItem>

                        <FormItem>
                            <Button type="primary" v-on:click="handleSubmit('foundCircle')">保存</Button>
                            <Button type="ghost" style="margin-left: 8px">取消</Button>
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
        name: 'create',
        data () {
            return {
                foundCircle: {},
                primaryId: 0,
                index: 1,
                uploadImageUrl: util.imageUploadUrl,
                visible: false,
                showImage: '',
                uploadList: [],
                defaultList: [],
                uploadList: [],
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
                            this.$axios.put('/admin/found/circle/' + this.primaryId, data).then((res) => {
                                if (res.statusCode === 200) {
                                    this.$Message.success('Success!');
                                }
                            });
                        } else {
                           
                        }
                        this.$Message.success('操作成功');
                        this.$router.push({
                            path: 'found/list'
                        })
                    } else {
                        this.$Message.error('Fail!');
                    }
                });
            },
            handleReset (name) {
                this.$refs[name].resetFields();
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
                console.log(this.uploadList.length)
                let check = 0;
                if (this.foundCircle.type === 2) {
                    check = (this.uploadList.length < 9);
                } else if (this.foundCircle.type === 3) {
                    check = (this.uploadList.length < 1);
                } else {
                    return false;
                }
                
                if (!check) {
                    this.$Notice.warning({
                        title: '最多上传九张图片'
                    });
                }
                return check;    
            },
            handleImageRemove (file) {
                const fileList = this.$refs.upload.fileList;
                this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
            },
            handleSuccess (res, file) {
                file.url = res.src
            }
        },
        created () {
            let query = this.$route.query
            if (query.id) {
                this.$axios.get('/admin/found/circle/' + query.id).then((res) => {
                    this.foundCircle = res.data
                    this.primaryId = query.id;
                    if (this.foundCircle.type === 2) {
                        this.foundCircle.extra.image.forEach(element => {
                            this.uploadList.push({
                                name: '',
                                url: element,
                                status: 'finished'
                            })
                        });
                    } else if (this.foundCircle.type === 3) {
                        this.uploadList.push({
                            name: '',
                            url: this.foundCircle.extra.video,
                            status: 'finished',
                            type: 'video',
                        })
                    }
                    
                }).catch((res) => {
                    this.$Message.error(res);
                });
            }
        },
        mounted () {
            this.uploadList = this.$refs.upload.fileList;
        }
    };
</script>

<style>
</style>
