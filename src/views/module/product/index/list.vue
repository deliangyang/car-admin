<template>
    <div>
        <Table border :columns="columns" :data="category" ref="table"></Table>
        <Page :total="total" :page-size="page_size" :current="current_page" show-total @on-change="change"></Page>
        <Modal title="View Image" v-model="visible">
            <img :src="showImage" v-if="visible" style="width: 100%">
        </Modal>
    </div>
</template>

<script>
    export default {
        name: 'list',
        data () {
            return {
                category: [],
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
                        key: 'title'
                    },
                    {
                        title: '简介',
                        key: 'summary'
                    },
                    {
                        title: '图片',
                        key: 'images',
                        render: (h, params) => {
                            if (params.row.image) {
                                return h('div', [
                                    h('Avatar', {
                                        props: {
                                            src: params.row.image.src,
                                            shape: 'square',
                                            icon: 'person',
                                            size: 'large'
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
                        key: 'amount'
                    },
                    {
                        title: '库存',
                        key: 'stock'
                    },
                    {
                        title: '销量',
                        key: 'sale'
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
            this.loadProducts(1);
        },
        computed: {},
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
                    this.category = res.data.data;
                    this.page_size = res.data.per_page;
                });
            },
            edit (index) {
                this.$router.push({
                    path: '/product/create-update',
                    query: {
                        id: this.category[index].id
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
