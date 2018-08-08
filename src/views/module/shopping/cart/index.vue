<template>
    <div>
        <Card>
            <p slot="title">购物车管理</p>
            <Table border :columns="columns" :data="shoppingCartData" ref="table"></Table>
            <Page :total="total" :page-size="page_size" :current="current_page" show-total @on-change="change"></Page>
        </Card>
    </div>
</template>

<script>
    export default {
        name: 'list',
        data () {
            return {
                shoppingCart: [],
                current_page: 1,
                total: 0,
                columns: [
                    {
                        title: '编号',
                        key: 'id',
                        width: 80
                    },
                    {
                        title: '名称',
                        key: 'title',
                        width: 200,
                        render: (h, params) => {
                            let productName = params.row.product.title
                            let skuName = params.row.sku.name
                            let number = params.row.number
                            return h('div', [
                                h('span', '【' + productName + '】' + skuName + 'x' + number)
                            ])
                        }
                    },
                    {
                        title: '价格',
                        key: 'amount',
                        width: 140
                    },
                    {
                        title: '用户',
                        key: 'user',
                        render: (h, params) => {
                            return h('div', params.row.user.nickname + ' ' + params.row.user.mobile)
                        }
                    },
                    {
                        title: '创建时间',
                        key: 'created_at',
                        width: 150
                    },
                    {
                        title: '更新时间',
                        key: 'updated_at',
                        width: 150
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
                                        type: 'error',
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
                                }, '移除')
                            ]);
                        }
                    }
                ],
                page_size: 15
            };
        },
        created () {
            this.loadShoppingCart(1);
        },
        computed: {
            shoppingCartData: function() {
                return this.shoppingCart.map((element) => {
                    return {
                        ...element,
                        amount: 'AU$ ' + (element.amount / 100).toFixed(2)
                    }
                })
            }
        },
        methods: {
            loadShoppingCart (page) {
                let params = {
                    params: {
                        page: page
                    }
                };
                this.$axios.get('/admin/shopping/cart', params).then((res) => {
                    this.total = res.data.total;
                    this.current_page = res.data.current_page;
                    this.shoppingCart = res.data.data;
                    this.page_size = res.data.per_page;
                });
            },
            change (page) {
                this.loadShoppingCart(page);
            }
        }
    };
</script>

<style scoped>

</style>
