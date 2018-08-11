<style lang="less">
.show-image-box {
    width: 100%;
}
</style>
<template>
    <div>
        <Card>
            <p slot="title">积分等级</p>
            <Table border :columns="tableColums" :data="integral" ref="table"></Table>
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
            integral: [],
            page_size: 20,
            current_page: 1,
            total: 0,
            tableColums: [
                {
                    title: '编号',
                    key: 'id',
                    width: 80,
                },
                {
                    title: '名称',
                    key: 'name',
                    width: 200,
                },
                {
                    title: '积分',
                    key: 'integral',
                },
                {
                    title: '备注',
                    key: 'remarks'
                },
                {
                    title: '创建于',
                    key: 'created_at',
                    width: 160,
                },
                {
                    title: '编辑于',
                    key: 'updated_at',
                    width: 160,
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
                        ]);
                    }
                }
            ]
        }
    },
    created () {

    },
    methods: {
        loadintegral () {
            this.$axios.get('/admin/integral/config').then((res) => {
                this.integral = res.data
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
                path: '/common/integral/create-update',
                query: {
                    id: this.integral[index].id
                }
            });
        },
        remove (index) {
            this.$axios.delete('/admin/integral/config' + this.integral[index].id).then((res) => {
                console.log(res)
                this.integral.splice(index, 1);
                this.$Message.success('删除成功')
            });
            
        }
    },
    mounted () {
        this.loadintegral()
    }
}
</script>
