<template>
    <div>
        <Row>
            <Col>
                <Card>
                    <p slot="title">商品分类</p>
                    <Table :v-if="refresh" border :columns="columns" :data="category" ref="table"></Table>
                    <Page :total="total" :page-size="page_size" :current="current_page" show-total @on-change="change"></Page>
                </Card>
            </Col>
        </Row>
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
                page_size: 15,
                refresh: true,
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
                        render: (h, params) => {
                            let parentCategory = '-'
                            if (params.row.category) {
                                parentCategory = params.row.category.name
                            }
                            return h('div', [
                                h('span', parentCategory)
                            ])
                        }
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
            //this.refresh = true
            this.loadProductCategory(1);
        },
        computed: {},
        methods: {
            loadProductCategory (page) {
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
                //this.refresh = false
            },
            edit (index) {
                this.$router.push({
                    path: '/product/category/create-update',
                    query: {
                        id: this.category[index].id
                    }
                });
            },
            change (page) {
                this.loadProductCategory(page)
            }
        },
        mounted () {
            this.refresh = false
            this.$nextTick(() => {
                this.refresh = true
            })
        },
        watch: {
            
        }
    };
</script>

<style scoped>

</style>
