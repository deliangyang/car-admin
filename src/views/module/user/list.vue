<template>
    <div>
        <Row>
            <Col>
                <Card>
                    <Table border :columns="columns" :data="user" ref="table"></Table>
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
                columns: [
                    {
                        title: '编号',
                        key: 'id',
                        width: 80
                    },
                    {
                        title: '昵称',
                        key: 'name',
                        width: 150
                    },
                    {
                        title: '性别',
                        key: 'gender',
                        width: 80,
                        render: (h, params) => {
                            let gender = ['保密', '男', '女']
                            let translateGender = gender[params.row.gender] || gender[0]
                            return h('div', [
                                h('span', translateGender)
                            ])
                        }
                    },
                    {
                        title: '头像',
                        key: 'avatar',
                        width: 80,
                        render: (h, params) => {
                            return h('div', [
                                h('Avatar', {
                                    props: {
                                        src: params.row.avatar,
                                        shape: 'square',
                                        icon: 'person',
                                        size: 'large'
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        title: '手机号码',
                        key: 'mobile',
                        width: 160
                    },
                    {
                        title: 'openId',
                        key: 'open_id',
                    },
                    {
                        title: '会员',
                        key: 'type',
                        width: 80,
                        render: (h, params) => {
                            let type;
                            if (params.row.type === 0) {
                                type = '普通';
                            } else if (params.row.type === 1) {
                                type = '会员';
                            }
                            return h('div', [
                                h('span', type)
                            ]);
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
                                }, '编辑')
                            ]);
                        }
                    }
                ],
                user: [],
                current_page: 1,
                total: 0
            };
        },
        created () {
            this.request(1);
        },
        methods: {
            request (page) {
                this.$axios.get('/admin/users', {params: {page: page}}).then((res) => {
                    this.user = res.data.data;
                    this.current_page = res.data.current_page;
                    this.article = res.data.data;
                    this.page_size = res.data.per_page;
                });
            },
            change (page) {
                this.request(page);
            },
            edit (index) {
                let userId = this.user[index].id
                this.$router.push({
                    path: '/user/edit',
                    query: {
                        id: userId
                    }
                });
            }
        },
        destroyed () {

        }
    };
</script>

<style>
</style>
