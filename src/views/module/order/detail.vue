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
                    <Col span="6">买家：{{order.user.nickname}}</Col>
                    <Col span="6">下单时间：{{order.created_at}}</Col>
                    <Col span="6">合计：AU$ <span class="total-amount">{{totalAmont}}</span></Col>
                </Row>
            </p>
            <div>
                <Table border :columns="orderItemColumns" :data="orderItems"></Table>
            </div>
        </Card>
        <Card class="mbt-10" v-if="order.add_value_service > 0">
            <p slot="title">增值服务</p>
            <FormItem label="增值服务拍照/标记">
                <div class="demo-upload-list" v-for="(item, index) in uploadList" :key="index">
                    <template v-if="item.status === 'finished'">
                        <video v-if="item.type==='video'" :src="item.url" style="width:100%;height:100%"></video>
                        <img v-else :src="item.url">
                        <div class="demo-upload-list-cover">
                            <Icon type="ios-eye-outline" @click.native="handleView(item.url, item.name)"></Icon>
                            <Icon type="ios-trash-outline" @click.native="handleImageRemove(item)"></Icon>
                        </div>
                    </template>
                    <template v-else>
                        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                    </template>
                </div>
                <Upload ref="upload"
                        name="image"
                        :show-upload-list="false"
                        :default-file-list="defaultList"
                        :on-success="handleSuccess"
                        :format="['jpg','jpeg','png',]"
                        :max-size="2048"
                        :on-format-error="handleFormatError"
                        :on-exceeded-size="handleMaxSize"
                        :before-upload="handleBeforeUpload"
                        multiple
                        type="drag"
                        :action="uploadImageUrl"
                        style="display: inline-block;width:58px;">
                    <div style="width: 58px;height:58px;line-height: 58px;">
                        <Icon type="camera" size="20"></Icon>
                    </div>
                </Upload>
            </FormItem>
        </Card>
        <Card class="mbt-10">
            <p slot="title">收件人地址</p>
            <Table border :columns="deliveryAddress" :data="[order.delivery_address]"></Table>
        </Card>
        <Card class="mbt-10">
            <p slot="title">发件人地址</p>
            <div v-if="order.consignor">
                <Table border :columns="deliveryAddress" :data="[order.consignor]"></Table>
            </div>
            <div v-else style="text-align:center;">
                <Button type="success">添加发件人</Button>
            </div>
        </Card>
    </div>
</template>

<script>
import util from '@/libs/util';
export default {
    data () {
        return {
            order: {},
            orderId: 0,
            orderItemColumns: [
                {
                    title: '商品名称',
                    key: 'title'
                },
                {
                    title: '子订单号',
                    key: 'sub_order_no',
                    width: 200,
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
            ],
            deliveryAddress: [
                {
                    title: '收件人',
                    key: 'name',
                },
                {
                    title: '手机号码',
                    key: 'mobile', 
                },
                {
                    title: '街道',
                    key: 'detail',
                },
                {
                    title: '快递商',
                    key: 'express_name',
                },
                {
                    title: '快递编号',
                    key: 'express_no',
                },
                {
                    title: '更新快递时间',
                    key: 'updated_at',
                }
            ]
        }
    },
    created () {
        let query = this.$route.query
        this.orderId = query.id
    },
    mounted() {
        this.$nextTick((res) => {
            if (this.orderId) {
                this.loadOrderDetail(this.orderId)
            }
        })
    },
    methods: {
        loadOrderDetail (orderId) {
            this.$axios.get('/admin/order/' + orderId).then((res) => {
                this.order = res.data
            });
        },
        handleView() {

        },
        handleImageRemove() {

        },
    },
    computed: {
        totalAmont: function() {
            return (this.order.total_amount / 100).toFixed(2)
        },
        orderItems: function() {
            return this.order.items.map((element) => {
                return {
                    ...element,
                    amount: 'AU$ ' + (element.amount / 100).toFixed(2)
                }
            })
        }
    }
}
</script>
