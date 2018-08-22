<template>
    <div>
        <Row>
            <Col>
                <Card>
                    <p slot="title">地址列表</p>
                    <Table border :columns="columns" :data="address" ref="table"></Table>
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
                address: [],
                current_page: 1,
                total: 0,
                columns: [
                    {
                        title: '编号',
                        key: 'id',
                        width: 60
                    },
                    {
                        title: '用户',
                        key: 'user_id',
                        width: 80
                    },
                    {
                        title: '联系方式',
                        key: 'contact',
                        width: 160
                    },
                    {
                        title: '地址',
                        key: 'location',
                        width: 300,
                    },
                    {
                        title: '街道',
                        key: 'address', 
                        width: 300        
                    },
                    {
                        title: '详细地址',
                        key: 'detail',
                        width: 300
                    },
                    {
                        title: '坐标',
                        key: 'point',
                        width: 200,
                        render: (h, params) => {
                            return h('div', [
                                h('span', `(${params.row.longitude}, ${params.row.latitude})`)
                            ])
                        }
                    },
                    {
                        title: '添加时间',
                        key: 'created_at',
                        width: 150
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        fixed: 'right',
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
            this.loadAddress(1);
        },
        computed: {},
        methods: {
            loadAddress (page) {
                let params = {
                    params: {
                        page: page
                    }
                };
                this.$axios.get('/admin/address', params).then((res) => {
                    this.total = res.data.total;
                    this.current_page = res.data.current_page;
                    this.address = res.data.data;
                    this.page_size = res.data.per_page;
                });
            },
            edit (index) {
                this.$router.push({
                    path: '/address/edit',
                    query: {
                        id: this.address[index].id
                    }
                });
            },
            change (page) {
                this.loadAddress(page);
            }
        },
    };
</script>

<style scoped>

</style>
