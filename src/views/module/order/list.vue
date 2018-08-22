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
                                    <Option value="beijing">订单关闭</Option>
                                    <Option value="shanghai">等待用户支付</Option>
                                    <Option value="shenzhen">已支付</Option>
                                    <Option value="shenzhen">已发货</Option>
                                    <Option value="shenzhen">已收货</Option>
                                    <Option value="shenzhen">已评价</Option>
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
                        <Col span="8">订单编号：{{item.order_no}}</Col>
                        <Col span="8" class="order-status">状态：
                            <span v-if="item.status == -1 || item.status == 0">
                                订单已关闭
                            </span>
                            <span v-else-if="item.status == 1">
                                等待买家付款
                            </span>
                            <span style="color:green" v-else-if="item.status == 2">
                                已付款
                            </span>
                        </Col>
                        <Col span="4">
                            <a @click="showUserInfo(index)">买家：{{item.user.nickname}}</a>
                        </Col>
                        <Col span="4">联系方式：{{item.user.mobile}}</Col>
                    </Row>
                </p>
                <Row>
                    <Table border :columns="orderItemColumns" :data="item.items"></Table>
                </Row>
                <Row class="order-info">
                    <Col span="3">买家备注：{{item.remarks || '无'}}</Col>
                    <Col span="3">支付时间：{{item.payed_at || '无'}}</Col>
                    <Col span="3">汇率：{{item.rate || '无'}}</Col>
                    <Col span="3">币种：{{item.currency || '无'}}</Col>
                    <Col span="3">支付渠道：{{item.channel || '无'}}</Col>                    
                </Row>
                <Row class="order-info">
                    <Col span="3">运费渠道：AU$ {{(item.express_fee / 100).toFixed(2) || '0.00'}}</Col>
                    <Col span="3">增值服务：AU$ {{(item.add_value_service / 100).toFixed(2) || '0.00'}}</Col>
                    <Col span="3">优惠券：AU$ {{(item.coupon_fee / 100).toFixed(2) || '0.00'}}</Col>
                    <Col span="3">总计：AU$ {{(item.total_amount / 100).toFixed(2) || '0.00'}}</Col>
                </Row>
                <Row class="total-info">
                    <Col span="2">
                        <Button @click="goToOrderDetailPage(item.id)" type="success">查看详情</Button>
                    </Col>
                    <Col span="2">
                        <Button v-if="item.address > 0" @click="goToOrderDetailPage(item.id)" type="primary">查看快递</Button>
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
            showUserInfo (index) {
                // let user = this.user[index].user
                //  this.$Modal.info({
                //     title: user.nickname,
                //     content: `Name：user.nickname<br>：${this.data6[index].age}<br>Address：${this.data6[index].address}`
                // })
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