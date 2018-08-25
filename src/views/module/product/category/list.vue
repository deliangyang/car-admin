<template>
    <div>
        <Card>
            <p slot="title">商品分类</p>
            <a href="/#/product/category/create-update" slot="extra">
                <Icon type="plus-round" ></Icon>
                添加
            </a>
            <Table :v-if="refresh" border :columns="columns" :data="category" ref="table"></Table>
            <Page :total="total" :page-size="page_size" :current="current_page" show-total @on-change="change"></Page>
        </Card>
    </div>
</template>

<script>
    export default {
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
                        title: '是否展示在首页',
                        key: 'show_home_page',
                        render: (h, params) => {
                            var show_home = '否';
                            if (params.row.show_home_page === 1) {
                                show_home = '是';
                            }
                            return h('div', show_home);
                        }
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
            this.$nextTick(() => {
                this.loadProductCategory(1);
            })
        },
        watch: {
            
        }
    };
</script>

<style scoped>

</style>
