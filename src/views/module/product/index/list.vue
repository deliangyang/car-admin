<template>
    <div>
        <Card>
            <p slot="title">商品列表</p>
            <Table border :columns="columns" :data="newProducts" ref="table"></Table>
            <Page :total="total" :page-size="page_size" :current="current_page" show-total @on-change="change"></Page>
            <Modal title="View Image" v-model="visible">
                <img :src="showImage" v-if="visible" style="width: 100%">
            </Modal>
        </Card>
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
                        key: 'title',
                        width: 200,
                    },
                    {
                        title: '简介',
                        key: 'summary',
                        width: 200
                    },
                    {
                        title: '图片',
                        key: 'images',
                        width: 120,
                        render: (h, params) => {
                            if (params.row.cover) {
                                return h('div', [
                                    h('img', {
                                        attrs: {
                                            src: params.row.cover,
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
                                                this.handleView(params.row.cover)
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
                            if (!params.row.qr_code) {
                                return h('div', '正在生成中');
                            }

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
                        title: '是否上架',
                        key: 'status',
                        width: 100,
                        render: (h, params) => {
                            let status = params.row.status
                            let statusText = '下架'
                            if (status === 1) {
                                statusText = '上架'
                            }
                            return h('span', statusText)
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 240,
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
                                }, '编辑'),
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
                                }, '热门'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.remove(params.index);
                                        }
                                    }
                                }, '删除')
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
                return this.products.map(element => {
                    return {
                        ...element,
                        amount: 'AU$ ' + (element.amount / 100).toFixed(2),
                    };
                });
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
            deleteProducts(productId) {
                this.$axios.delete('/admin/products/' + productId).then((res) => {
                    this.$Message.success('删除成功');
                });
            },
            change (page) {
                this.loadProducts(page);
            },
            remove(index) {
                let product = this.products[index];
                let self = this;
                this.$Modal.confirm({
                    title: '是否要删除该商品',
                    content: product.title,
                    onOk: function() {
                        let productId = product.id;
                        self.products.splice(index, 1);
                        self.deleteProducts(productId);
                    },
                    onCancel: function() {
                        this.$Message.info('已取消');
                    }
                });
            },
            handleView (imageUrl, name) {
                this.showImage = imageUrl;
                this.visible = true;
            },
        }
    };
</script>

<style scoped>

</style>
