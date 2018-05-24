<style scoped>
    .table-header {
        margin-bottom: 10px;
    }
</style>
<template>
    <div>
        <Table border :columns="columns" :data="article" ref="table"></Table>
        <Page :total="total" :current="current_page" show-total @on-change="change"></Page>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                columns: [
                    {
                        title: '标题',
                        key: 'title',
                    },
                    {
                        title: '分类',
                        key: 'category'
                    },
                    {
                        title: '简介',
                        key: 'summary'
                    },
                    {
                        title: 'Action',
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
                                            this.show(params.index)
                                        }
                                    }
                                }, 'View'),
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
                                }, 'Delete')
                            ]);
                        }
                    }
                ],
                article: [],
                current_page: 1,
                total: 0
            }
        },
        created: function () {
            this.request(1)
        },
        methods: {
            request(page) {
                this.$axios.get('/article', {page: page}).then((res) => {
                    this.total = res.data.total
                    this.current_page = res.data.current_page
                    this.article = res.data.data
                })
            },
            show(index) {
                this.$Modal.info({
                    title: '文章内容',
                    content: `${this.article[index].content}`
                })
            },
            remove(index) {
                this.users.splice(index, 1);
                let user_id = this.users[index].user_id
                this.$axios.delete('/admin/users/' + user_id, {id: this.users[index].id}).then((res) => {
                    console.log(res)
                });
            },
            edit(index, data) {
                let user_id = this.users[index].user_id
                this.users.update('/admin/users/' + user_id, {_method: 'delete'}).then((res) => {

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
            change (page) {
                console.log(1)
                this.request(page)
            }
        }
    }
</script>
