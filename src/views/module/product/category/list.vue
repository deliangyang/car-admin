<template>
    <div>
        <Table border :columns="columns" :data="category" ref="table"></Table>
        <Page :total="total" :page-size="page_size" :current="current_page" show-total @on-change="change"></Page>
    </div>
</template>

<script>
    export default {
        name: 'list',
        data () {
            return {
                category: [],
                current_page: 1,
                total: 0
            };
        },
        created() {
            this.request(1);
        },
        computed: {},
        methods: {
            request (page) {
                this.$axios.get('/admin/product/category', {params: {page: page}}).then((res) => {
                    this.total = res.data.total;
                    this.current_page = res.data.current_page;
                    this.category = res.data.data;
                    this.page_size = res.data.per_page;
                });
            }
        }
    };
</script>

<style scoped>

</style>
