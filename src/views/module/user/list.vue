<template>

</template>
<script>
    export default {
        name: 'list',
        data() {
            return {
                user: []
            }
        },
        created() {

        },
        methods: {
            listRequest: function(page) {
                this.$axios.get('/admin/user/list', {params: {page: page}}).then(function(res) {
                    console.log(res)
                    this.user.list = res.data
                    this.total = res.data.total
                    this.current_page = res.data.current_page
                    this.article = res.data.data
                    this.page_size = res.data.per_page
                })
            }
        },
        destroyed() {

        },
    }
</script>

<style>
</style>