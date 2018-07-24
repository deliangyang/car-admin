<style lang="less">
.show-image-box {
    width: 100%;
}
</style>
<template>
    <div>
        <Card>
            <p slot="title">
                系统公告
            </p>
            <a href="#/common/system/notice/add-update" slot="extra">
                <Icon type="plus-round"></Icon>
                添加公告
            </a>
            <Table border :columns="tableColums" :data="sysNotice" ref="table"></Table>
        </Card>
    </div>
</template>
<script>
export default {
    data () {
        return {
            visible: false,
            sysNotice: [],
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
                    title: '标题',
                    key: 'title',
                    width: 120
                },
                {
                    title: '内容',
                    key: 'content',
                    width: 300
                },
                {
                    title: '创建于',
                    key: 'created_at'
                },
                {
                    title: '编辑于',
                    key: 'updated_at'
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
        loadSysNotice () {
            this.$axios.get('/admin/system/notice').then((res) => {
                this.sysNotice = res.data.data
                this.total = res.data.total
                this.current_page = res.data.current_page
                this.page_size = res.data.per_page
            }).catch((res) => {

            })
        },
        show (index) {
            this.$router.push({
                path: '/common/system/notice/add-update?id=' + this.sysNotice[index].id
            })
        },
        remove (index) {
            let id = this.sysNotice[index].id
            this.$axios.delete('/admin/system/notice/' + id).then((res) => {
                this.$Message.success('删除成功');
                this.sysNotice.splice(index, 1);
            })
        }
    },
    mounted () {
        this.loadSysNotice()
    }
}
</script>
