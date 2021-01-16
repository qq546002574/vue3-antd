import {RouteRecordRaw} from 'vue-router'
import {RouterTransition} from '@/components/transition'

const routeName = 'tactics'

const routes: Array<RouteRecordRaw> = [{
    path: '/tactics',
    name: routeName,
    redirect: '/tactics/template',
    component: RouterTransition,
    meta: {
        title: '策略配置',
        icon: 'EditOutlined'
    },
    children: [
        {
            path: 'template',
            name: `${routeName}-template`,
            meta: {
                title: '策略模板',
                icon: 'UserOutlined'
            },
            component: () => import(/* webpackChunkName: "tactics-template" */ '@/views/tactics/template/index.vue')
        },
        {
            path: 'quartz',
            name: `${routeName}-quartz`,
            meta: {
                title: '定时任务',
                icon: 'ClockCircleFilled'
            },
            component: RouterTransition,
            children: [
                {
                    path: '',
                    name: `${routeName}-quartz-list`,
                    meta: {
                        title: '任务列表',
                        icon: 'HomeOutlined'
                    },
                    component: () => import('@/views/tactics/quartz/list.vue')
                },
                {
                    path: ':jobId',
                    name: `${routeName}-quartz-info`,
                    props: true,
                    meta: {
                        title: '任务详情',
                        icon: 'HomeOutlined',
                        hidden: true,
                    },
                    component: () => import(/* webpackChunkName: "object-jenkins-info" */ '@/views/tactics/quartz/info.vue')
                },
            ]
        }
    ]
}]

export default routes
