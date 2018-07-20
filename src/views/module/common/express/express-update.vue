<style lang="less">

</style>
<template>
    <div>
        <Card>
            <p slot="title">首页滚屏</p>
            <Form ref="rollScreen" :model="rollScreen" :validate="ruleValidate" :label-width="80">
                <Row>
                    <Col span="12">
                        <FormItem label="名称">
                            <Input v-model="rollScreen.name" placeholder="名称"></Input>
                        </FormItem>

                        <FormItem label="排序">
                            <Input v-model="rollScreen.sort" placeholder="排序"></Input>
                        </FormItem>

                        <FormItem label="图片">
                            <div class="demo-upload-list" v-for="(item, index) in uploadList" :key="index">
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
                                    :action="uploadImageUrl"
                                    style="display: inline-block;width:58px;">
                                <div style="width: 58px;height:58px;line-height: 58px;">
                                    <Icon type="camera" size="20"></Icon>
                                </div>
                            </Upload>
                            <Modal title="View Image" v-model="visible">
                                <img :src="showImage" v-if="visible" style="width: 100%">
                            </Modal>
                        </FormItem>
                       
                        <FormItem>
                            <Button type="primary" @click="handleSubmit('rollScreen')">保存</Button>
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
            uploadImageUrl: util.imageUploadUrl,
            rollScreenId: 0,
            visible: false,
            showImage: '',
            uploadList: [],
            defaultList: [],
            uploadList: [],
            rollScreen: {},
            ruleValidate: {
                name: [
                    { required: true, message: '标题不能为空', trigger: 'blur' }
                ],
                sort: [
                    { required: true, message: '标题不能为空', trigger: 'blur' }
                ],
            },
        }
    },
    methods: {
        handleSubmit (name) {
            if (this.rollScreenId > 0) {
                this.$axios.put('/admin/roll/screen/' + this.rollScreenId, this.rollScreen).then((res) => {
                    this.$Message.success('修改成功');
                    this.$router.push({
                        path: '/common/rollscreen'
                    })
                }).catch((res) => {
                    console.log(1)
                    this.$Message.error(res.message);
                })
            } else {
                this.$axios.post('/admin/roll/screen', this.rollScreen).then((res) => {
                    this.$Message.success('添加成功');
                    this.$router.push({
                        path: '/common/rollscreen'
                    })
                })
            }
            this.$refs[name].validate((valid) => {
                console.log(valid)
                if (valid) {
                    
                } else {
                    this.$Message.error('验证失败');
                }
            })
        },
        loadRollScreen (id) {
            this.$axios.get('/admin/roll/screen/' + id).then((res) => {
                this.rollScreen.name = res.data.name
                this.rollScreen.cover = res.data.cover
                this.rollScreen.sort = res.data.sort
                this.showImage = res.data.cover
                this.uploadList.push({
                    status: 'finished',
                    name: res.data.name,
                    url: res.data.cover
                })
            })
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
            this.$refs.upload.fileList.splice(0, 1)
            return true
        },
        handleImageRemove (file) {
            const fileList = this.$refs.upload.fileList;
            this.rollScreen.cover = ''
        },
        handleSuccess (res, file) {
            file.url = res.src
            this.rollScreen.cover = res.src
        },
    },
    created () {
        let query = this.$route.query
        this.rollScreenId = query.id
        this.loadRollScreen(this.rollScreenId)
    },
    mounted () {
        this.uploadList = this.$refs.upload.fileList;
    }
}
</script>
