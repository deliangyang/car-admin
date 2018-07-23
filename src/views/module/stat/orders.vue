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
                        title: '未支付订单数',
                        key: 'un_pay_count'
                    },
                    {
                        title: '已支付订单数',
                        key: 'paid_count'
                    },
                    {
                        title: '未支付金额',
                        key: 'un_pay'
                    },
                    {
                        title: '已支付金额',
                        key: 'paid'
                    },
                    {
                        title: '总订单数',
                        key: 'total',
                        render: (h, params) => {
                            return h('div', params.row.un_pay_count + params.row.paid_count)
                        }
                    },
                    {
                        title: '总订单金额',
                        key: 'total',
                        render: (h, params) => {
                            return h('div', params.row.un_pay + params.row.paid)
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
                this.$axios.get('/admin/stat/daily/orders', params).then((res) => {
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
