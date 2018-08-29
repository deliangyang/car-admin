<template>
    <div class="order-list">
        <div>
            <Card class="search-box">
                <p slot="title">订单搜索</p>
                <Form ref="search" :model="search" :rules="searchRule" inline :label-width="70">
                    <Row>
                        <Col span="6">
                            <FormItem label="用户编号" style="width:100%;">
                                <Input v-model="search.user_id" placeholder="用户编号"></Input>
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem label="订单号" style="width:100%;">
                                <Input v-model="search.order_no" placeholder="订单号"></Input>
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem label="订单状态" style="width:100%;">
                                <Select v-model="search.status">
                                    <Option value="all">全部</Option>
                                    <Option value="unpay">待付款</Option>
                                    <Option value="waitDelivery">待发货</Option>
                                    <Option value="delivery">已发货</Option>
                                    <Option value="finished">已完成</Option>
                                    <Option value="waitComment">待评价</Option>
                                </Select>
                            </FormItem>
                        </col>
                        <Col span="6">
                            <FormItem label="支付金额">
                                <Row>
                                    <Col span="10">
                                        <Input v-model="search.min_amount" placeholder="最小"></Input>
                                    </Col>
                                    <Col class="item-splite" span="4"> ~ </Col>
                                    <Col span="10">
                                        <Input v-model="search.max_amount" placeholder="最大"></Input>
                                    </Col>
                                </Row>
                            </FormItem>
                        </Col>
                        <Col span="8">
                            <FormItem label="下单时间">
                                <DatePicker type="datetimerange" format="yyyy-MM-dd HH:mm" @on-change="changeQueryOrderTimeRange"
                                placeholder="请输入开始时间和结束时间" style="width:300px;"></DatePicker>
                            </FormItem>
                        </Col>
                        <Col span="6">
                            <FormItem>
                                <Button type="primary" @click="handlerSearch('search')">搜索</Button>
                            </FormItem>
                        </Col>
                    </Row>
                </Form>
            </Card>
        </div>
        <div v-for="(item, index) in orders" v-bind:key="index">
            <Card class="order-item-box">
                <p slot="title">
                    <Row>
                        <Col span="7">订单编号#{{item.id}}：{{item.order_no}}</Col>
                        <Col span="4" class="order-status">状态：
                            <span v-if="item.status == -1 || item.status == 0">订单已关闭</span>
                            <span v-else-if="item.status == 1">等待买家付款</span>
                            <span style="color:green" v-else-if="item.status == 2 && !item.delivery_at">已付款</span>
                            <span style="color:green" v-else-if="item.status == 2 && item.delivery_at">已发货</span>
                            <span style="color:green" v-else-if="item.status == 4 && item.delivery_at">待评价</span>
                            <span style="color:green" v-else-if="item.status == 5 && item.delivery_at">已完成</span>
                        </Col>
                        <Col span="7">
                            <a @click="showUserInfo(index)">买家：{{item.user.nickname}}</a>
                        </Col>
                        <Col span="4">联系方式：{{item.user.mobile}}</Col>
                    </Row>
                </p>
                <Row>
                    <Table border :columns="orderItemColumns" :data="item.items"></Table>
                </Row>
                <Row class="order-info">
                    <Col span="6">买家备注：{{item.remarks || '无'}}</Col>
                    <Col span="6">支付时间：{{item.payed_at || '无'}}</Col>
                    <Col span="4">汇率：{{item.rate || '无'}}</Col>
                    <Col span="4">币种：{{item.currency || '无'}}</Col>
                    <Col span="4">支付渠道：{{item.channel || '无'}}</Col>                    
                </Row>
                <Row class="order-info">
                    <Col span="6">运费渠道：AU$ {{(item.express_fee / 100).toFixed(2) || '0.00'}}</Col>
                    <Col span="6">增值服务：AU$ {{(item.add_value_service / 100).toFixed(2) || '0.00'}}</Col>
                    <Col span="6">优惠券：AU$ {{(item.coupon_fee / 100).toFixed(2) || '0.00'}}</Col>
                    <Col span="6">总计：AU$ {{(item.total_amount / 100).toFixed(2) || '0.00'}}</Col>
                </Row>
                <Row class="total-info">
                    <Col span="2">
                        <Button @click="goToOrderDetailPage(item.id)" type="success">查看详情</Button>
                    </Col>
                    <Col span="2">
                        <Button v-if="item.address > 0" @click="goToOrderDetailPage(item.id)" type="primary">查看快递</Button>
                    </Col>
                    <Col span="2" v-if="item.status === 2 && !item.delivery_at">
                        <Button @click="goToDelivery(index)" type="primary">发货</Button>
                    </Col>
                    <Col span="2" v-if="item.status === 2 && item.delivery_at">
                        <Button @click="finishedDelivery(index)" type="error">已收到快递</Button>
                    </Col>
                    <!-- <Col span="2" v-if="item.status === 1">
                        <Button type="error">完成付款</Button>
                    </Col> -->
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
                value: '',
                delivery: {

                },
                showDelivery:false,
                search: {

                },
                searchRule: {

                },
                orders: [],
                current_page: 1,
                total: 0,
                page_size: 20,
                orderItemColumns: [
                    {
                        title: '商品名称',
                        key: 'title',
                    },
                    {
                        title: '子订单号',
                        key: 'sub_order_no',
                        width: 200
                    },
                    {
                        title: '商品编号',
                        key: 'product_id',
                        width: 100
                    },
                    {
                        title: 'sku',
                        key: 'sku_id',
                        width: 80
                    },
                    {
                        title: '金额(AUD)',
                        key: 'amount',
                        width: 120,
                        render: (h, params) => {
                            return h('div', 'AU$ ' + (params.row.amount / 100).toFixed(2))
                        }
                    },
                    {
                        title: '数量',
                        key: 'number',
                        width: 80
                    },
                    {
                        title: '下单时间',
                        key: 'created_at',
                        width: 200,
                    }
                ]
            };
        },
        computed: {
            
        },
        methods: {
            getOrderList (params) {
                this.$axios.get('/admin/order', {params: params}).then((res) => {
                    this.total = res.data.total;
                    this.current_page = res.data.current_page;
                    this.orders = res.data.data;
                    this.page_size = res.data.per_page;
                });
            },
            change (page) {
                this.getOrderList({
                    page: page
                })
            },
            goToOrderDetailPage (id) {
                this.$router.push({
                    path: '/order/detail',
                    query: {
                        id: id
                    }
                });
            },
            changeQueryOrderTimeRange (time) {
                console.log(time);
                this.search.start_at = time[0]
                this.search.end_at = time[1]
            },
            handlerSearch () {
                let params = this.search
                params.page = 1
                this.getOrderList(params)
            },
            goToDelivery(index) {
                let order = this.orders[index];
                this.$axios.get('/admin/order/delivery/' + order.id).then((res) => {
                    this.delivery.orderNo = res.data.express_no;
                    this.orders[index].delivery_at = res.data.updated_at;
                    this.showDeliveryModel(order);
                });
            },
            updateDeliveryExpressNo(expressNo, orderId) {
                let data = {
                    orderId: orderId,
                    expressNo: expressNo,
                };
                this.$axios.put('/admin/order/delivery/' + orderId, data).then((res) => {
                    this.$Message.success('修改成功');
                });
            },
            helpUserFinishedDelivery(orderId, index) {
                let data = {
                    target: 'finishedDeliver',
                };
                this.$axios.put('/admin/order/' + orderId, data).then((res) => {
                    this.orders[index].status = res.data.status;
                    this.$Message.info('已收到快递');
                });
            },
            finishedDelivery(index) {
                let self = this;
                let order = this.orders[index];
                this.$Modal.confirm({
                    title: '确定用户已经收到快递？',
                    okText: '确定',
                    onOk: () => {
                        self.helpUserFinishedDelivery(order.id, index);
                    },
                });
            },
            showDeliveryModel(order) {
                let self = this;
                this.$Modal.confirm({
                    title: order.title + '<br />' + order.order_no,
                    okText: '发货',
                    onOk: () => {
                        // 快递单号
                        self.updateDeliveryExpressNo(this.delivery.orderNo, order.id);
                    },
                    render: (h) => {
                        return h('div', [
                            h('Input', {
                                props: {
                                    label: '快递单号',
                                    value: this.delivery.orderNo,
                                    autofocus: true,
                                    placeholder: '快递单号'
                                },
                                style: {
                                    margin: '10px 0',
                                },
                                on: {
                                    input: (val) => {
                                        this.delivery.orderNo = val;
                                    }
                                }
                            })
                        ])
                    }
                });
            }
        },

        created () {
            this.getOrderList({page: 1})
        }
    };
</script>

<style lang="less">
.order-list {
    .order-item-box {
        margin-bottom: 10px;
        .total-info {
            margin-top: 20px;
        }
        .order-status {
            color: red;
        }
    }
    .search-box {
        margin-bottom: 10px;
    }
    .item-splite {
        text-align: center;
    }
    .order-info {
        margin: 5px 0;
    }
}
</style>