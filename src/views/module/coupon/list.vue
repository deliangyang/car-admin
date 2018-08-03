<template>
    <div>
        <Card>
            <p slot="title">优惠券管理</p>
            <Table border :columns="columns" :data="coupons" ref="table"></Table>
            <Page :total="total" :page-size="page_size" :current="current_page" show-total @on-change="change"></Page>    
        </Card>    
    </div>
</template>

<script>
    export default {
        name: 'list',
        components: {
        },
        data () {
            return {
                coupons: [],
                current_page: 1,
                showImage: '',
                visible: false,
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
                        title: '满',
                        key: 'fill_up',
                    },
                    {
                        title: '总数',
                        key: 'count',
                    },
                    {
                        title: '库存',
                        key: 'stock',
                    },
                    {
                        title: '开始时间',
                        key: 'start_at',
                    },
                    {
                        title: '结束时间',
                        key: 'expire_at'
                    },
                    {
                        title: '使用范围',
                        key: 'use_scope',
                    },
                    {
                        title: '使用商品',
                        key: 'products',
                    },
                    {
                        title: '优惠',
                        key: 'discount',
                        align: 'center',
                        width: 240,
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
                                            this.edit(params.row.id);
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
            this.loadProducts(1);
        },
        computed: {
        },
        methods: {
            loadProducts (page) {
                let params = {
                    params: {
                        page: page
                    }
                };
                this.$axios.get('/admin/coupon', params).then((res) => {
                    this.total = res.data.total;
                    this.current_page = res.data.current_page;
                    this.coupons = res.data.data;
                    this.page_size = res.data.per_page;
                });
            },
            edit (id) {
                this.$router.push({
                    path: '/coupon/create-update',
                    query: {
                        id: id
                    }
                });
            },
            change (page) {
                this.loadProducts(page);
            },
            handleView (imageUrl, name) {
                console.log(imageUrl)
                this.showImage = imageUrl;
                this.visible = true;
            },
        }
    };
</script>

<style scoped>

</style>
