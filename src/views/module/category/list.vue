<style scoped>
    .table-header {
        margin-bottom: 10px;
    }
</style>
<template>
    <div>
        <Card>
            <p slot="title">首页分类</p>
            <a href="#/common/category/add-update" slot="extra">
                <Icon type="plus-round"></Icon>
                添加分类
            </a>
            <Table border :columns="columns" :data="categories" ref="table"></Table>
            <Page :total="total" :page-size="page_size" :current="current_page" show-total @on-change="change"></Page>    
        </Card>        
    </div>
</template>

<script>
    export default {
        data() {
            return {
                columns: [
                    {
                        title: '编号',
                        key: 'id',
                        width: 80
                    },
                    {
                        title: '名称',
                        key: 'name',
                    },
                    {
                        title: '排序',
                        key: 'sort',
                        width: 80
                    },
                    {
                        title: '封面',
                        key: 'cover',
                        align: 'center',
                        width: 120,
                        render: (h, params) => {
                            return h('div', [
                                h('Avatar', {
                                    props: {
                                        src: params.row.cover,
                                        shape: 'square',
                                        size: 'large'
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        title: '跳转途径',
                        key: 'url'
                    },
                    {
                        title: '状态',
                        key: 'status',
                        width: 80,
                        render: (h, params) => {
                            let status = '启用'
                            if (params.row.status === 0) {
                                let status = '停用';
                            }
                            return h('div', status)
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
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
                                            this.edit(params.index)
                                        }
                                    }
                                }, '编辑'),
                            ]);
                        }
                    }
                ],
                categories: [],
                current_page: 1,
                total: 0
            }
        },
        created: function () {
            this.request(1)
        },
        methods: {
            request(page) {
                this.$axios.get('/category', {params: {page: page}}).then((res) => {
                    this.total = res.data.total
                    this.current_page = res.data.current_page
                    this.categories = res.data.data
                    this.page_size = res.data.per_page
                })
            },
            show(index) {
                
            },
            remove(index) {
                this.users.splice(index, 1);
                this.$axios.delete('/admin/users/' + user_id, {id: this.users[index].id}).then((res) => {
                    console.log(res)
                });
            },
            edit(index, data) {
                this.$router.push({
                    path: '/common/category/add-update?id=' + this.categories[index].id
                })
            },
            exportData(type) {
                if (type === 1) {
                    this.$refs.table.exportCsv({
                        filename: 'The original data'
                    });
                } else if (type === 2) {
                    this.$refs.table.exportCsv({
                        filename: 'Sorting and filtering data',
                        original: false
                    });
                } else if (type === 3) {
                    this.$refs.table.exportCsv({
                        filename: 'Custom data',
                        columns: this.columns8.filter((col, index) => index < 4),
                        data: this.data7.filter((data, index) => index < 4)
                    });
                }
            },
            change(page) {
                this.request(page)
            }
        }
    }
</script>
