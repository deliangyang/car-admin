<template>
    <div>
         <Card>
            <p slot="title">更新用户属性</p>
            <Form ref="user" :model="user" :rules="ruleValidate" :label-width="80">
                <Row>
                    <Col span="12">
                        <FormItem label="昵称" prop="nickname">
                            <Input v-model="user.nickname" placeholder="昵称"></Input>
                        </FormItem>

                        <FormItem label="会员属性" prop="userType">
                            <Select v-model="user.type" style="width:200px">
                                <Option v-for="(item, key) in userTypes" :value="item.id" :key="key">{{ item.name }}</Option>
                            </Select>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" @click="handleSubmit('user')">保存</Button>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        </Card>
    </div>
</template>
<script>
    export default {
        name: 'create',
        data() {
            return {
                userId: 0,
                user: {},
                userTypes: [],
                ruleValidate: {
                    nickname: [
                        { required: true, message: '昵称不能为空', trigger: 'blur' }
                    ]
                }
            }
        },
        created() {
            let query = this.$route.query
            if (query.id) {
                this.userId = query.id
                
            }
        },
        mounted () {
            this.loadUserInfo(this.userId)
        },
        watch: {
            'user.type': function(newer, old) {
                console.log(newer, old)
            }
        },
        computed: {
            
        },
        methods: {
            loadUserInfo (userId) {
                this.$axios.get('/admin/users/' + userId).then((res) => {
                    this.userTypes = res.data.userTypes
                    this.user = res.data.user
                })
            },
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        let params = {
                            nickname: this.user.nickname,
                            type: this.user.type
                        }
                        this.$axios.put('/admin/users/' + this.userId, params).then((res) => {
                            this.$Message.success('Success!');
                            this.$router.push({
                                path: '/users/list'
                            })
                        })
                    } else {
                        this.$Message.error('Fail!');
                    }
                })
            },
            choiceUserType (type) {
                console.log(type)
                this.user.type = type
            }
        },
        destroyed() {

        }
    }
</script>

<style>
</style>