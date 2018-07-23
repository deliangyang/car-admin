<template>
    <div>
        <Row>
            <Col>
                <Card>
                    <Table border :columns="columns" :data="stat" ref="table"></Table>
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
                shoppingCart: [],
                current_page: 1,
                total: 0,
                columns: [
                    {
                        title: '日期',
                        key: 'date'
                    },
                    {
                        title: '普通会员',
                        key: 'normal'
                    },
                    {
                        title: '黄金会员',
                        key: 'gold'
                    },
                    {
                        title: '铂金会员',
                        key: 'platinum'
                    },
                    {
                        title: '钻石会员',
                        key: 'diamond'
                    },
                    {
                        title: '总数',
                        key: 'total',
                        render: (h, params) => {
                            return h('div', params.row.normal + params.row.gold 
                            + params.row.platinum + params.row.diamond)
                        }
                    }
                ],
                page_size: 15
            };
        },
        created () {
            this.loadStat(1);
        },
        computed: {},
        methods: {
            loadStat (page) {
                let params = {
                    params: {
                        page: page
                    }
                };
                this.$axios.get('/admin/stat/daily/register', params).then((res) => {
                    this.total = res.data.total;
                    this.current_page = res.data.current_page;
                    this.stat = res.data.data;
                    this.page_size = res.data.per_page;
                });
            },
            change (page) {
                this.loadStat(page);
            }
        }
    };
</script>

<style scoped>

</style>
