<style lang="less" scoped>
.order-list {
    .order-item-box {
        margin-bottom: 10px;
        .total-info {
            margin-top: 20px;
        }
    }
}
</style>

<template>
    <div class="order-list">
        <div v-for="(item, index) in orders" v-bind:key="index">
            <Card class="order-item-box">
                <p slot="title">
                    <Row>
                        <Col span="8">订单编号：{{item.order_no}}</Col>
                        <Col span="8">买家：{{item.user_id}}</Col>
                    </Row>
                </p>
                <Row>
                    <Table border :columns="orderItemColumns" :data="item.items"></Table>
                </Row>
                <Row class="total-info">
                    <Col span="2" offset="22">
                        <Button @click="goToOrderDetailPage(item.id)" type="success">查看详情</Button>
                    </Col>
                </Row>
            </Card>
        </div>
        <Page :total="total" :page-size="page_size" :current="current_page" show-total @on-change="change"></Page>
    </div>
</template>

<script>
    export default {
        name: 'list',
        data () {
            return {
                orders: [],
                current_page: 1,
                total: 0,
                orderItemColumns: [
                    {
                        title: '商品名称',
                        key: 'title'
                    },
                    {
                        title: '子订单号',
                        key: 'sub_order_no',
                    },
                    {
                        title: 'sku',
                        key: 'sku_id'
                    },
                    {
                        title: '金额',
                        key: 'amount',
                    },
                    {
                        title: '数量',
                        key: 'number',
                    },
                    {
                        title: '下单时间',
                        key: 'created_at'
                    }
                ]
            };
        },
        computed: {
            
        },
        methods: {
            getOrderList (page) {
                this.$axios.get('/admin/order', {params: {page: page}}).then((res) => {
                    this.total = res.data.total;
                    this.current_page = res.data.current_page;
                    this.orders = res.data.data;
                    this.page_size = res.data.per_page;
                });
            },
            change (page) {
                this.getOrderList(page)
            },
            goToOrderDetailPage (id) {
                this.$router.push({
                    path: '/order/detail',
                    query: {
                        id: id
                    }
                });
            }
        },

        created () {
            this.getOrderList(1)
        }
    };
</script>

<style scoped>

</style>
