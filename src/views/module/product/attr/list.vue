<template>
    <div>
        <Card>
            <p slot="title">Sku</p>
            <Table border :columns="columns" :data="skuValues" ref="table"></Table>
            <Page :total="total" :page-size="page_size" :current="current_page" show-total @on-change="change"></Page>
        </Card>
    </div>
</template>

<script>
    export default {
        name: 'list',
        data () {
            return {
                skuValues: [],
                current_page: 1,
                total: 0,
                page_size: 20,
                columns: [
                    {
                        title: '编号',
                        key: 'id',
                        width: 80
                    },
                    {
                        title: '名称',
                        key: 'name',
                        width: 160
                    },
                    {
                        title: '父分类',
                        key: 'category',
                        width: 160,
                        render: (h, params) => {
                            return h('div', [
                                h('span', params.row.category.name)
                            ])
                        }
                    },
                    {
                        title: '子分类',
                        key: 'sub_category',
                        width: 160,
                        render: (h, params) => {
                            return h('div', [
                                h('span', params.row.sub_category.name)
                            ])
                        }
                    },
                    {
                        title: '单位',
                        key: 'unit',
                        width: 80
                    },
                    {
                        title: '属性（滑动查看全部）',
                        key: 'attr_values',
                        width: 400,
                        render: (h, params, index) => {
                            let values = []
                            let color = ['blue', 'green', 'red', 'yellow', ]
                            //let rand = 0
                            params.row.attr_values.forEach(element => {
                                //rand = Math.floor(Math.random() * color.length)
                                values.push(h('Tag', {
                                    props: {
                                        color: color[element.attr_id % color.length]
                                    },
                                    style: {
                                        margin: '5px'
                                    }
                                }, element.name + (params.row.unit === '-' ? '' : params.row.unit)))
                            });
                            return h('div', values)
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        fixed: 'right',
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
            this.loadSkuValues(1);
        },
        computed: {},
        methods: {
            loadSkuValues (page) {
                let params = {
                    params: {
                        page: page
                    }
                };
                this.$axios.get('/admin/sku/value', params).then((res) => {
                    this.total = res.data.total;
                    this.current_page = res.data.current_page;
                    this.skuValues = res.data.data;
                    this.page_size = res.data.per_page;
                });
            },
            edit (index) {
                this.$router.push({
                    path: '/product/attr/create-update',
                    query: {
                        id: this.skuValues[index].id
                    }
                });
            },
            change (page) {
                this.loadSkuValues(page)
            }
        }
    };
</script>

<style scoped>

</style>
