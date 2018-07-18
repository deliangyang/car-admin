<style lang="less">
.mbt-10 {
    margin-bottom: 10px;
}
.order-detail-box {
    .total-amount {
        color: red;
    }
}
</style>

<template>
    <div>
        <Card class="order-detail-box mbt-10">
            <p slot="title">
                <Row>
                    <Col span="6">订单编号：{{order.order_no}}</Col>
                    <Col span="6">买家：{{order.user_id}}</Col>
                    <Col span="6">下单时间：{{order.created_at}}</Col>
                    <Col span="6">合计：$ <span class="total-amount">{{order.total_amount}}</span> AUD</Col>
                </Row>
                <div>
                    <Table border :columns="orderItemColumns" :data="order.items"></Table>
                </div>
            </p>
        </Card>
        <Card class="mbt-10">
            <p slot="title">收件人地址</p>

        </Card>
        <Card class="mbt-10">
            <p slot="title">发件人地址</p>
        </Card>
    </div>
</template>

<script>
export default {
    data () {
        return {
            order: {},
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
        }
    },
    created () {
        let query = this.$route.query
        if (query.id) {
            this.loadOrderDetail(query.id)
        }
    },
    methods: {
        loadOrderDetail (orderId) {
            this.$axios.get('/admin/order/' + orderId).then((res) => {
                this.order = res.data
            }).catch((res) => {

            })
        }
    }
}
</script>
