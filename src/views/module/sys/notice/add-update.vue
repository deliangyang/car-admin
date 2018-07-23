<style lang="less">

</style>
<template>
    <div>
        <Card>
            <Form ref="sysNotice" :model="sysNotice" :rules="ruleValidate" :label-width="80">
                <Row>
                    <Col span="12">
                        <FormItem label="内容">
                            <Input v-model="sysNotice.content" type="textarea" :autosize="{minRows: 5,maxRows: 10}" placeholder="内容"></Input>
                        </FormItem>

                        <FormItem label="类型">
                            <Select v-model="sysNotice.type" style="width:200px" :disabled="!!primaryId">
                                <Option :value="1">文字</Option>
                                <Option :value="2">图文</Option>
                                <Option :value="3">视频分享</Option>
                            </Select>
                        </FormItem>

                        <FormItem label="状态">
                            <Select v-model="sysNotice.status" style="width:200px">
                                <Option :value="0">禁用</Option>
                                <Option :value="1">启用</Option>
                            </Select>
                        </FormItem>

                        <FormItem label="图片或视频" v-if="this.sysNotice.type !== 1">
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
                            <Button type="primary" v-on:click="handleSubmit('sysNotice')">保存</Button>
                            <Button type="ghost" style="margin-left: 8px">取消</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        </Card>
    </div>
</template>
<script>
export default {
    data () {
        return {
            primaryId: 0,
            sysNotice: {}
        }
    },
    created () {
        let query = this.$router.query
        this.primaryId = query.id ? query.id : 0
    },
    methods: {
        loadSysNotice (id) {
            this.$axios.get('/admin/system/notice/' + id).then((res) => {
                this.sysNotice = res.data
            }).catch((res) => {

            })
        }
    },
    mounted () {
        if (this.primaryId) {
            this.loadSysNotice(this.primaryId)
        }
    }
}
</script>
