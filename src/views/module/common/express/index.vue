<style lang="less">
.show-image-box {
    width: 100%;
}
</style>
<template>
    <div>
        <Card>
            <p slot="title">
                <Row>
                    <Col span="20">
                        <div>快递管理</div>
                    </Col>
                </Row>
            </p>
            <Table border :columns="tableColums" :data="dataExpress" ref="table"></Table>
            <Modal title="View Image" v-model="visible">
                <img :src="showImage" v-if="visible" class="show-image-box">
            </Modal>
        </Card>
    </div>
</template>
<script>
export default {
    data () {
        return {
            showImage: '',
            visible: false,
            express: [],
            page_size: 20,
            current_page: 1,
            total: 0,
            tableColums: [
                {
                    title: '编号',
                    key: 'id'
                },
                {
                    title: '名称',
                    key: 'title'
                },
                {
                    title: '价格',
                    key: 'amount'
                },
                {
                    title: '描述',
                    key: 'description'
                },
                {
                    title: '操作',
                    key: 'action',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.show(params.index)
                                    }
                                }
                            }, '编辑'),
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.remove(params.index)
                                    }
                                }
                            }, '删除')
                        ]);
                    }
                }
            ]
        }
    },
    created () {

    },
    methods: {
        loadRollScreen () {
            this.$axios.get('/admin/express').then((res) => {
                this.express = res.data
                this.total = res.data.total
                this.current_page = res.data.current_page
                this.page_size = res.data.per_page
            }).catch((res) => {

            })
        },
        showTheImage (image) {
            console.log(image)
            this.showImage = image
            this.visible = true
        },
        show (index) {
            this.$router.push({
                path: '/common/rollscreen/create-update',
                query: {
                    id: this.rollScreen[index].id
                }
            });
        },
        remove (index) {
            this.$axios.delete('/admin/roll/screen/' + this.rollScreen[index].id).then((res) => {
                console.log(res)
                this.rollScreen.splice(index, 1);
                this.$Message.success('删除成功')
            });
            
        }
    },
    mounted () {
        this.loadRollScreen()
    },
    computed: {
        dataExpress: function() {
            let data = []
            this.express.forEach((element) => {
                element.amount = '$ ' + (element.amount / 100).toFixed(2) + ' AUD'
                data.push(element)
            })
            return data
        }
    }
}
</script>
