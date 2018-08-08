<template>
    <div>
        <Card>
            <p slot="title">海壳圈管理</p>
            <Table border :columns="columns" :data="foundCircle" ref="table"></Table>
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
                foundCircle: [],
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
                        title: '内容',
                        key: 'content'
                    },
                    {
                        title: '类型',
                        key: 'type',
                        render: (h, params) => {
                            let type = '文字'
                            if (params.row.type === 2) {
                                type = '图文'
                            } else if (params.row.type === 3) {
                                type = '视频'
                            }
                            return h('div', type)
                        }
                    },
                    {
                        title: '动态',
                        key: 'moment',
                        align: 'center',
                        width: 240,
                        render: (h, params) => {
                            try {
                                let extra = JSON.parse(params.row.extra)
                                if (params.row.type == 2) {
                                    let images = []
                                    extra.image.forEach(element => {
                                        console.log(element)
                                        let item = h('Avatar', {
                                            props: {
                                                shape: 'square',
                                                size: 'large',
                                                src: element
                                            },
                                            style: {
                                                margin: '5px'
                                            },
                                        })
                                        images.push(item)
                                    });
                                    return h('div', images)
                                } else if (params.row.type == 3) {
                                    return h('div', [
                                        h('video', {
                                            attrs: {
                                                src: extra.video,
                                                controls: 'controls'
                                            },
                                            style: {
                                                width: '200px',
                                                height: '150px',
                                                textAlign: 'center',
                                                borderRadius: '10px',
                                                marginTop: '5px'
                                            }
                                        })
                                    ]);
                                }
                            } catch (e) {
                                return h('div', e)
                            }
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
                this.$axios.get('/admin/found/circle', params).then((res) => {
                    this.total = res.data.total;
                    this.current_page = res.data.current_page;
                    this.foundCircle = res.data.data;
                    this.page_size = res.data.per_page;
                });
            },
            edit (id) {
                this.$router.push({
                    path: '/found/cicle/create-update',
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
