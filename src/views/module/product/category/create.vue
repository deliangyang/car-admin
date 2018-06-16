<template>
    <div>
        <Row>
            <Col span="18">
                <Card>
                    <Form :model="formItem" :label-width="80">
                        <FormItem label="名称">
                            <Input v-model="formItem.name" placeholder="Enter something..."></Input>
                        </FormItem>
                        <FormItem label="父分类">
                            <Select v-model="formItem.pid">
                                <Option value="0">未选择</Option>
                                <Option v-for="(item, index) in parentCategory" value="item.pid">{item.name}</Option>
                            </Select>
                        </FormItem>
                        <FormItem label="排序">
                            <Input v-model="formItem.sort" placeholder="Enter something..."></Input>
                        </FormItem>
                        <FormItem label="状态">
                            <Input v-model="formItem.status" placeholder="Enter something..."></Input>
                        </FormItem>
                        <FormItem>
                            <Button type="primary" @onclick="addOrUpdateProductCategory">Submit</Button>
                            <Button type="ghost" style="margin-left: 8px">Cancel</Button>
                        </FormItem>
                    </Form>
                </Card>
            </Col>
        </Row>
    </div>
</template>
<script>
    export default {
        name: 'create',
        data () {
            return {
                parentCategory: [],
                formItem: {
                    name: '',
                    pid: 0,
                    status: 0,
                    sort: 0,
                }
            };
        },
        created () {
            let params = {
                params: {
                    pid: 0
                }
            };
            this.$axios.get('/admin/product/category', params).then((res) => {
                this.parentCategory = res.data.data;
            });
        },
        methods () {
            addOrUpdateProductCategory: function() {
                if (true) {
                    this.$axios.post('admin/product/category', this.formItem).then((res) => {
                        console.log(res.data)
                    });
                }
            }
        },
        destroyed () {

        },
    };
</script>

<style>
</style>
