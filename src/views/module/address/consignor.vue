<template>
    <div>
        <Row>
            <Col>
                <Card>
                    <p slot="title">发货地址</p>
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
                        title: '省份',
                        key: 'country',
                        width: 80,
                        render: (h, params) => {
                            return h('div', [
                                h('span', params.row.province.name)
                            ])
                        }
                    },
                    {
                        title: '城市',
                        key: 'province',
                        width: 80,
                        render: (h, params) => {
                            return h('div', [
                                h('span', params.row.city.name)
                            ])
                        }
                    },
                    {
                        title: '区县',
                        key: 'city', 
                        width: 80,     
                        render: (h, params) => {
                            return h('div', [
                                h('span', params.row.country.name)
                            ])
                        }                  
                    },
                    {
                        title: '详细地址',
                        key: 'detail'
                    },
                    {
                        title: '坐标',
                        key: 'point',
                        render: (h, params) => {
                            return h('div', [
                                h('span', `(${params.row.longitude}, ${params.row.latitude})`)
                            ])
                        }
                    },
                    {
                        title: '添加时间',
                        key: 'created_at'
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
