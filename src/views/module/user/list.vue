<style lang="less">
   .search-box {
       .form {
           height: 36px;
       }
   }
</style>

<template>
    <div>
        <Card class="search-box card-buttom">
            <p slot="title">搜索用户</p>
            <Form class="form" ref="search" :model="search" :rules="searchRule" inline :label-width="70">
                <Row>
                    <Col span="6">
                        <FormItem label="用户编号" style="width:100%;" prop="user_id">
                            <Input v-model="search.user_id" placeholder="用户编号"></Input>
                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem label="用户昵称" style="width:100%;" prop="nickname">
                            <Input v-model="search.nickname" placeholder="用户昵称"></Input>
                        </FormItem>
                    </Col>
                    <Col span="6">
                        <FormItem label="会员属性" style="width:100%;" prop="userType">
                            <Select v-model="search.type">
                                <Option v-for="(item, key) in agentConfig" :value="item.id" :key="key">{{item.name}}</Option>
                            </Select>
                        </FormItem>
                    </col>
                    <Col span="6">
                        <FormItem>
                            <Button type="primary" @click="handlerSearch('search')">搜索</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        </Card>
        <Card class="card-buttom">
            <p slot="title">用户管理</p>
            <Table border :columns="columns" :data="user" ref="table"></Table>
            <Page :total="total" :page-size="page_size" :current="current_page" show-total @on-change="change"></Page>
        </Card>        
    </div>
</template>
<script>
    export default {
        name: 'list',
        data () {
            return {
                page_size: 20,
                search: {},
                searchRule: {},
                agentConfig: [],
                columns: [
                    {
                        title: '编号',
                        key: 'id',
                        width: 80
                    },
                    {
                        title: '昵称',
                        key: 'name'
                    },
                    {
                        title: '性别',
                        key: 'gender',
                        width: 80,
                        render: (h, params) => {
                            let gender = ['保密', '男', '女']
                            let translateGender = gender[params.row.gender] || gender[0]
                            return h('div', [
                                h('span', translateGender)
                            ])
                        }
                    },
                    {
                        title: '头像',
                        key: 'avatar',
                        width: 80,
                        render: (h, params) => {
                            return h('div', [
                                h('Avatar', {
                                    props: {
                                        src: params.row.avatar,
                                        shape: 'square',
                                        icon: 'person',
                                        size: 'large'
                                    }
                                })
                            ]);
                        }
                    },
                    {
                        title: '手机号码',
                        key: 'mobile',
                        width: 150
                    },
                    {
                        title: '地址',
                        key: 'address',
                        width: 200,
                        render: (h, params) => {
                            let address = params.row.country + ' ' + params.row.province + ' ' + params.row.city
                            return h('div', address)
                        }
                    },
                    {
                        title: 'openId',
                        key: 'open_id',
                        width: 240
                    },
                    {
                        title: '会员',
                        key: 'title',
                        width: 100
                    },
                    {
                        title: '注册时间',
                        key: 'created_at',
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
                                }, '编辑')
                            ]);
                        }
                    }
                ],
                user: [],
                current_page: 1,
                total: 0,
                page: 1
            };
        },
        created () {
            this.loadUsers();
            this.loadAgentConfig()
        },
        methods: {
            loadUsers () {
                let params = {
                    page: this.page,
                }
                for (const key in this.search) {
                    if (this.search.hasOwnProperty(key)) {
                        const element = this.search[key]
                        params[key] = element
                    }
                }
                this.$axios.get('/admin/users', {params: params}).then((res) => {
                    this.user = res.data.data;
                    this.current_page = res.data.current_page;
                    this.article = res.data.data;
                    this.page_size = res.data.per_page;
                    this.page++
                });
            },
            loadAgentConfig () {
                this.$axios.get('/admin/sale/distribute/agent').then((res) => {
                    this.agentConfig = res.data
                })
            },
            change (page) {
                this.loadUsers();
            },
            edit (index) {
                let userId = this.user[index].id
                this.$router.push({
                    path: '/user/edit',
                    query: {
                        id: userId
                    }
                });
            },
            handlerSearch(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.page = 1
                        this.loadUsers()
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            }
        },
        destroyed () {

        }
    };
</script>

