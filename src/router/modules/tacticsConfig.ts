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
        }
    ]
}]

export default routes
