<template>
    <div>
        <Row>
            <Col>
                <Card>
                    <Table border :columns="columns" :data="feedback" ref="table"></Table>
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
                feedback: [],
                current_page: 1,
                total: 0,
                page_size: 20,
                columns: [
                    {
                        title: '编号',
                        key: 'id',
                        width: 80
                    },
                    {
                        title: '标题',
                        key: 'title',
                        width: 80
                    },
                    {
                        title: '联系方式',
                        key: 'contact',
                        width: 160
                    },
                    {
                        title: '链接',
                        key: 'url',
                        width: 200
                    },
                    {
                        title: '图片',
                        key: 'unit',
                        width: 70,
                        render: (h, params) => {
                            return h('div', [
                                h('Avatar', {
                                    props: {
                                        src: params.row.image,
                                        shape: 'square',
                                        icon: 'person',
                                        size: 'large'
                                    }
                                })
                            ])
                        }
                    },
                    {
                        title: '内容',
                        key: 'content',
                        width: 150
                    },
                    {
                        title: '留言回复',
                        key: 'remark',
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
                                }, '回复')
                            ]);
                        }
                    }
                ],
            };
        },
        created() {
            this.loadFeedback(1);
        },
        computed: {},
        methods: {
            loadFeedback (page) {
                let params = {
                    params: {
                        page: page
                    }
                };
                this.$axios.get('/admin/feedback', params).then((res) => {
                    this.total = res.data.total;
                    this.current_page = res.data.current_page;
                    this.feedback = res.data.data;
                    this.page_size = res.data.per_page;
                });
            },
            edit (index) {
                this.$router.push({
                    path: '/feedback/reply',
                    query: {
                        id: this.feedback[index].id
                    }
                });
            },
            change (page) {
                this.loadFeedback(page)
            }
        }
    };
</script>

<style scoped>

</style>
