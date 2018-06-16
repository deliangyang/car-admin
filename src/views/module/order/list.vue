<template>
    <div>
        <Table border :columns="columns" :data="article" ref="table"></Table>
        <Page :total="total" :page-size="page_size" :current="current_page" show-total @on-change="change"></Page>
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
                    },
                    {
                        title: '名称',
                        key: 'name',
                    },
                    {
                        title: '排序',
                        key: 'sort',
                    },
                    {
                        title: '状态',
                        key: 'status'
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
                            ]);
                        }
                    }
                ],
                article: [],
                current_page: 1,
                total: 0
            };
        },
        computed: {
            request (page) {
                this.$axios.get('/orders', {params: {page: page}}).then((res) => {
                    this.total = res.data.total;
                    this.current_page = res.data.current_page;
                    this.article = res.data.data;
                    this.page_size = res.data.per_page;
                });
            }
        },
        methods: {}
    };
</script>

<style scoped>

</style>
