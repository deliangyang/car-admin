import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: () => import('@/views/login.vue')
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: () => import('@/views/error-page/404.vue')
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: () => import('@//views/error-page/403.vue')
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: () => import('@/views/error-page/500.vue')
};

// export const preview = {
//     path: '/preview',
//     name: 'preview',
//     component: () => import('@/views/form/article-publish/preview.vue')
// };

export const locking = {
    path: '/locking',
    name: 'locking',
    component: () => import('@/views/main-components/lockscreen/components/locking-page.vue')
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/home',
    component: Main,
    children: [
        {path: 'home', title: {i18n: 'home'}, name: 'home_index', component: () => import('@/views/home/home.vue')},
        {
            path: 'ownspace',
            title: '个人中心',
            name: 'ownspace_index',
            component: () => import('@/views/own-space/own-space.vue')
        },
        // { path: 'order/:order_id', title: '订单详情', name: 'order-info', component: () => import('@/views/advanced-router/component/order-info.vue') }, // 用于展示动态路由
        {path: 'message', title: '消息中心', name: 'message_index', component: () => import('@/views/message/message.vue')},
        {
            path: 'product/attr/create-update', title: '商品属性', name: 'product_attr_create_update',
            component: () => import('@/views/module/product/attr/edit.vue')
        },
        {
            path: 'address/edit',
            name: 'address-edit',
            title: '编辑收货地址',
            component: () => import('@/views/module/address/edit.vue')
        },
        {
            path: 'feedback/reply',
            name: 'feedback-reply',
            title: '回复反馈',
            component: () => import('@/views/module/feedback/reply.vue')
        },
        {path:'order/detail', name:'order-detail', title:'订单详情', component: () => import('@/views/module/order/detail.vue')},
        {path:'user/edit', name:'user-update', title:'编辑用户信息', component: () => import('@/views/module/user/create.vue')},
        {path:'found/cicle/create-update', name:'found-cicle-update', title:'编辑发现', component: () => import('@/views/module/found/update.vue')},
        {path: 'common/rollscreen/create-update', name:'roll-screen-update-create', title: '添加轮播图', component: () => import('@/views/module/common/rollscreen/create-update.vue')},
        {path: 'common/system/notice/add-update', name:'sys-notice-add-update', title: '更新公告', component: () => import('@/views/module/sys/notice/add-update.vue')},
        {path: 'common/category/add-update', name:'category-add-update', title: '更新分类', component: () => import('@/views/module/category/add-update.vue')},
        {path: 'common/integral/create-update', name:'integral-config-add-update', title: '更新积分配置', component: () => import('@/views/module/common/integral/create-update.vue')},
        {path: 'common/express/create-update', name:'express-create-update', title: '更新快递', component: () => import('@/views/module/common/express/create-update.vue')},
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    // {
    //     path: '/access',
    //     icon: 'key',
    //     name: 'access',
    //     title: '权限管理',
    //     component: Main,
    //     children: [
    //         { path: 'index', title: '权限管理', name: 'access_index', component: () => import('@/views/access/access.vue') }
    //     ]
    // },
    // {
    //     path: '/access-test',
    //     icon: 'lock-combination',
    //     title: '权限测试页',
    //     name: 'accesstest',
    //     access: 0,
    //     component: Main,
    //     children: [
    //         { path: 'index', title: '权限测试页', name: 'accesstest_index', access: 0, component: () => import('@/views/access/access-test.vue') }
    //     ]
    // },
    // {
    //     path: '/international',
    //     icon: 'earth',
    //     title: {i18n: 'international'},
    //     name: 'international',
    //     component: Main,
    //     children: [
    //         { path: 'index', title: {i18n: 'international'}, name: 'international_index', component: () => import('@/views/international/international.vue') }
    //     ]
    // },
    {
        path: '/users',
        icon: 'person',
        name: 'component',
        title: '用户管理',
        component: Main,
        children: [
            {
                path: 'list',
                icon: 'person',
                name: 'user-list',
                title: '用户列表',
                component: () => import('@/views/module/user/list.vue')
            },
        ]
    },
    // {
    //     path: '/article',
    //     icon: 'social-buffer',
    //     name: 'component',
    //     title: '文章知识',
    //     component: Main,
    //     children: [
    //         {
    //             path: 'list',
    //             icon: 'compose',
    //             name: 'article-list',
    //             title: '文章列表',
    //             component: () => import('@/views/module/article/list.vue')
    //         },
    //         {
    //             path: 'create',
    //             icon: 'compose',
    //             name: 'article-create',
    //             title: '文章更新',
    //             component: () => import('@/views/module/article/create.vue')
    //         },
    //     ]
    // },
    {
        path: '/found',
        icon: 'social-buffer',
        name: 'found',
        title: '发现页管理',
        component: Main,
        children: [
            {
                path: 'list',
                icon: 'compose',
                name: 'found-list',
                title: '发现列表',
                component: () => import('@/views/module/found/list.vue')
            },
        ]
    },
    {
        path: '/order',
        icon: 'social-usd',
        name: 'order',
        title: '订单管理',
        component: Main,
        children: [
            {
                path: 'list',
                icon: 'social-usd',
                name: 'order-list',
                title: '订单列表',
                component: () => import('@/views/module/order/list.vue')
            },
        ]
    },
    {
        path: '/coupon',
        icon: 'social-usd',
        name: 'coupon',
        title: '优惠券管理',
        component: Main,
        children: [
            {
                path: 'list',
                icon: 'social-usd',
                name: 'coupon-list',
                title: '优惠券列表',
                component: () => import('@/views/module/coupon/list.vue')
            },
        ]
    },
    {
        path: '/product',
        icon: 'ios-cart-outline',
        name: 'product',
        title: '商品管理',
        component: Main,
        children: [
            {
                path: 'create-update',
                icon: 'ios-filing',
                name: 'product-create-update',
                title: '添加商品',
                component: () => import('@/views/module/product/index/create.vue')
            },
            {
                path: 'index/list',
                icon: 'ios-cart',
                name: 'product-index-list',
                title: '商品列表',
                component: () => import('@/views/module/product/index/list.vue')
            },
            {
                path: 'category/list',
                icon: 'ios-pricetag-outline',
                name: 'product-category-list',
                title: '商品分类列表',
                component: () => import('@/views/module/product/category/list.vue')
            },
            {
                path: 'attr/list',
                icon: 'ios-pricetag-outline',
                name: 'product-attr-list',
                title: '商品Sku属性',
                component: () => import('@/views/module/product/attr/list.vue')
            },
            {
                path: 'category/create-update',
                icon: 'ios-filing',
                name: 'product-category-create-update',
                title: '添加商品分类',
                component: () => import('@/views/module/product/category/create.vue')
            },
        ]
    },
    {
        path: '/shopping',
        icon: 'ios-cart-outline',
        name: 'shopping',
        title: '购物车管理',
        component: Main,
        children: [
            {
                path: 'cart',
                icon: 'ios-filing',
                name: 'shopping-cart',
                title: '购物车商品',
                component: () => import('@/views/module/shopping/cart/index.vue')
            },
        ]
    },
    {
        path: '/address',
        icon: 'ios-cart-outline',
        name: 'address',
        title: '地址管理',
        component: Main,
        children: [
            {
                path: 'list',
                icon: 'ios-filing',
                name: 'address-list',
                title: '收货地址',
                component: () => import('@/views/module/address/index.vue')
            },
            {
                path: 'consignor',
                icon: 'ios-filing',
                name: 'address-deverliy-list',
                title: '发货地址',
                component: () => import('@/views/module/address/consignor.vue')
            },
        ]
    },
    {
        path: '/feedback',
        icon: 'ios-cart-outline',
        name: 'feedback',
        title: '反馈管理',
        component: Main,
        children: [
            {
                path: 'list',
                icon: 'ios-filing',
                name: 'feedback-list',
                title: '意见反馈',
                component: () => import('@/views/module/feedback/index.vue')
            },
        ]
    },
    {
        path: '/common',
        icon: 'ios-setting',
        name: 'common',
        title: '常用配置',
        component: Main,
        children: [
            {path: 'rollscreen', name:'roll-screen', title: '首页轮播图', component: () => import('@/views/module/common/rollscreen/index.vue')},
            {path: 'system/notice', name:'system-notice-index', title: '系统公告', component: () => import('@/views/module/sys/notice/index.vue')},
            {
                path: 'category',
                icon: 'compose',
                name: 'category-list',
                title: '首页分类',
                component: () => import('@/views/module/category/list.vue')
            },
            {path: 'integral/config', name:'integral-config-index', title: '积分配置', component: () => import('@/views/module/common/integral/index.vue')},
        ]
    },
    {
        path: '/express',
        icon: 'ios-setting',
        name: 'express',
        title: '快递管理',
        component: Main,
        children: [
            {path: 'index', name:'express-list', title: '快递列表', component: () => import('@/views/module/common/express/index.vue')},
        ]
    },
    {
        path: '/stat',
        icon: 'ios-setting',
        name: 'stat',
        title: '数据统计',
        component: Main,
        children: [
            {path: 'register', name:'stat-register', title: '注册统计', component: () => import('@/views/module/stat/register.vue')},
            {path: 'order', name:'stat-order', title: '订单统计', component: () => import('@/views/module/stat/orders.vue')},
        ]
    }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    otherRouter,
    //preview,
    locking,
    ...appRouter,
    page500,
    page403,
    page404
];
