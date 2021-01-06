import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'

//引入nprogress
import NProgress from 'nprogress' // 进度条
import 'nprogress/nprogress.css' // 进度条样式

import objectManage from './modules/objectManage'
import tacticsConfig from './modules/tacticsConfig'
import system from './modules/system'
import redirect from './modules/redirect'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Layout',
        redirect: '/object/jenkins',
        component: () => import(/* webpackChunkName: "layout" */ '@/layout/index.vue'),
        meta: {
            title: '首页'
        },
        children: [...objectManage, ...tacticsConfig, ...system, ...redirect]
    },
    {
        path: '/login',
        name: 'login',
        component: () => import(/* webpackChunkName: "login" */ '@/views/login/index.vue')
    },
    {
        path: '/:catchAll(.*)',
        redirect: '/',
    }
]

const router = createRouter({
    // process.env.BASE_URL
    history: createWebHashHistory(''),
    routes
})

// 简单配置
NProgress.inc(0.2)
NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false })

router.beforeEach((to,from,next) => {
    NProgress.start()
    next()
})

router.afterEach(() => {
    NProgress.done()
})

export default router
