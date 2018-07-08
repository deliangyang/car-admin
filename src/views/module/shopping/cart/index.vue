<template>
    <div>
        <Row>
            <Col>
                <Card>
                    <Table border :columns="columns" :data="shoppingCart" ref="table"></Table>
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
                shoppingCart: [],
                current_page: 1,
                total: 0,
                columns: [
                    {
                        title: '编号',
                        key: 'id'
                    },
                    {
                        title: '名称',
                        key: 'title',
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
                        key: 'amount'
                    },
                    {
                        title: '用户编号',
                        key: 'user_id',
                        render: (h, params) => {
                            return h('div', [
                                h('div', {
                                    props: {
                                        
                                    },
                                    on: {
                                        click: () => {
                                            this.showUser(params.index);
                                        }
                                    }
                                }, 'ID: ' + params.row.user_id)
                            ])
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
                page_size: 15
            };
        },
        created () {
            this.loadShoppingCart(1);
        },
        computed: {},
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
            },
            showUser (index) {
                let userId = this.shoppingCart[index].user_id
                this.$axios.get('/admin/users/' + userId).then((res) => {
                    let user = res.data
                    this.$Modal.info({
                        title: user.name,
                        content: `Country：${user.country}<br>Province：${user.province}<br>City：${user.city}`
                    })
                })
            }
        }
    };
</script>

<style scoped>

</style>
