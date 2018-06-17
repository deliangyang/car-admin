<template>
    <div>
        <Table border :columns="columns" :data="category" ref="table"></Table>
        <Page :total="total" :page-size="page_size" :current="current_page" show-total @on-change="change"></Page>
    </div>
</template>

<script>
    export default {
        name: 'list',
        data () {
            return {
                category: [],
                current_page: 1,
                total: 0,
                columns: [
                    {
                        title: '编号',
                        key: 'id'
                    },
                    {
                        title: '名称',
                        key: 'name'
                    },
                    {
                        title: '父分类',
                        key: 'pid',
                    },
                    {
                        title: '排序',
                        key: 'sort'
                    },
                    {
                        title: '状态',
                        key: 'status',
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
                                            this.edit(params.index);
                                        }
                                    }
                                }, '编辑')
                            ]);
                        }
                    }
                ],
            };
        },
        created() {
            this.request(1);
        },
        computed: {},
        methods: {
            request (page) {
                let params = {
                    params: {
                        page: page
                    }
                };
                this.$axios.get('/admin/product/category', params).then((res) => {
                    this.total = res.data.total;
                    this.current_page = res.data.current_page;
                    this.category = res.data.data;
                    this.page_size = res.data.per_page;
                });
            },
            edit (index) {
                this.$router.push({
                    path: '/product/category/create-update',
                    query: {
                        id: this.category[index].id
                    }
                });
            }
        }
    };
</script>

<style scoped>

</style>
