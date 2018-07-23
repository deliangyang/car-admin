<style lang="less" scoped>
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
}
</style>

<template>
    <div class="order-list">
        <div>
            <Card class="search-box">
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
                        <Col span="8">买家：{{item.user_id}}</Col>
                        <Col span="8" class="order-status">状态：
                            <span v-if="item.status == -1 || item.status == 0">
                                订单已关闭
                            </span>
                            <span v-else-if="item.status == 1">
                                等待买家付款
                            </span>
                        </Col>
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
                        title: '金额(AUD)',
                        key: 'amount',
                        render: (h, params) => {
                            return h('div', '$ ' + (params.row.amount / 100).toFixed(2))
                        }
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
            }
        },

        created () {
            this.getOrderList({page: 1})
        }
    };
</script>

<style scoped>

</style>
