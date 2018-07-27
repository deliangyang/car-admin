<template>
    <div>
        <Table border :columns="columns" :data="newProducts" ref="table"></Table>
        <Page :total="total" :page-size="page_size" :current="current_page" show-total @on-change="change"></Page>
        <Modal title="View Image" v-model="visible">
            <img :src="showImage" v-if="visible" style="width: 100%">
        </Modal>
    </div>
</template>

<script>
import util from '@/libs/util';

    export default {
        name: 'list',
        data () {
            return {
                products: [],
                current_page: 1,
                showImage: '',
                visible: false,
                total: 0,
                columns: [
                    {
                        title: '编号',
                        key: 'id',
                        width: 80
                    },
                    {
                        title: '名称',
                        key: 'title'
                    },
                    {
                        title: '简介',
                        key: 'summary'
                    },
                    {
                        title: '图片',
                        key: 'images',
                        width: 120,
                        render: (h, params) => {
                            if (params.row.image) {
                                return h('div', [
                                    h('img', {
                                        attrs: {
                                            src: params.row.image.src,
                                            shape: 'square',
                                            icon: 'person',
                                            size: 'large'
                                        },
                                        style: {
                                            width: '80px',
                                            height: '80px'
                                        },
                                        on: {
                                            click: () => {
                                                this.handleView(params.row.image.src)
                                            }
                                        }
                                    })
                                ]);
                            }
                        }
                    },
                    {
                        title: '价格',
                        key: 'amount',
                        width: 120
                    },
                    {
                        title: '库存',
                        key: 'stock',
                        width: 80
                    },
                    {
                        title: '销量',
                        key: 'sale',
                        width: 80
                    },
                    {
                        title: '标签',
                        key: 'tag',
                        width: 100
                    },
                    {
                        title: '小程序码',
                        key: 'qr_code',
                        width: 120,
                        render: (h, params) => {
                            return h('img', {
                                attrs: {
                                    src: util.HOST + '/' + params.row.qr_code
                                },
                                style: {
                                    width: '80px',
                                    height: '80px'
                                },
                                on: {
                                    click: () => {
                                        this.handleView(util.HOST + '/' + params.row.qr_code)
                                    }
                                }
                            })
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
                                            this.edit(params.index);
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
                                            this.edit(params.index);
                                        }
                                    }
                                }, '热门')
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
            newProducts: function() {
                let tmpProducts = []
                this.products.forEach(element => {
                    element.amount = 'AU$ ' + (element.amount / 100).toFixed(2)
                    tmpProducts.push(element)
                });
                return tmpProducts;
            }
        },
        methods: {
            loadProducts (page) {
                let params = {
                    params: {
                        page: page
                    }
                };
                this.$axios.get('/admin/products', params).then((res) => {
                    this.total = res.data.total;
                    this.current_page = res.data.current_page;
                    this.products = res.data.data;
                    this.page_size = res.data.per_page;
                });
            },
            edit (index) {
                this.$router.push({
                    path: '/product/create-update',
                    query: {
                        id: this.products[index].id
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
