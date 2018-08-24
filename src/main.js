import Vue from 'vue';
import iView from 'iview';
import {router} from './router/index';
import {appRouter} from './router/router';
import store from './store';
import App from './app.vue';
import '@/locale';
import 'iview/dist/styles/iview.css';
import VueI18n from 'vue-i18n';
import util from './libs/util';
import axios from 'axios';

Vue.use(VueI18n);
Vue.use(iView);

let vueAxios = axios.create({
    baseURL: 'https://xcx.sourcedev.cc/',
    timeout: 1000,
    headers: {}
});

vueAxios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    console.log(response);
    return response;
}, function (error) {
    if (error.response.data.message.length) {
        iView.Message.error({
            content: error.response.data.message,
            duration: 5,
            closable: true
        });
    }
    return Promise.reject(error);
});

Vue.prototype.$axios = vueAxios;

new Vue({
    el: '#app',
    router: router,
    store: store,
    render: h => h(App),
    data: {
        currentPageName: ''
    },
    mounted() {
        this.currentPageName = this.$route.name;
        // 显示打开的页面的列表
        this.$store.commit('setOpenedList');
        this.$store.commit('initCachepage');
        // 权限菜单过滤相关
        this.$store.commit('updateMenulist');
        // iview-admin检查更新
        util.checkUpdate(this);
    },
    created() {
        let tagsList = [];
        appRouter.map((item) => {
            if (item.children.length <= 1) {
                tagsList.push(item.children[0]);
            } else {
                tagsList.push(...item.children);
            }
        });
        this.$store.commit('setTagsList', tagsList);
    }
});
