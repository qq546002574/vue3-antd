import {RouteRecordRaw} from 'vue-router'
import {RouterTransition} from '@/components/transition'
import {h} from 'vue'

const routeName = 'object'

const routes: Array<RouteRecordRaw> = [{
    path: '/object',
    name: routeName,
    redirect: '/object/jenkins',
    component: h(RouterTransition, {notNeedKey: true}),
    meta: {
        title: '对象管理',
        icon: 'ApartmentOutlined'
    },
    children: [
        // {
        //     path: 'terminal',
        //     name: `${routeName}-terminal`,
        //     meta: {
        //         title: '终端管理',
        //         icon: 'DesktopOutlined'
        //     },
        //     component: RouterTransition,
        //     children: [
        //         {
        //             path: '',
        //             name: `${routeName}-terminal-list`,
        //             meta: {
        //                 title: '终端列表',
        //                 icon: 'HomeOutlined'
        //             },
        //             component: () => import(/* webpackChunkName: "object-terminal-list" */ '@/views/object/terminal/list.vue')
        //         },
        //         {
        //             path: ':pid',
        //             name: `${routeName}-terminal-info`,
        //             props: true,
        //             meta: {
        //                 title: '终端详情',
        //                 icon: 'HomeOutlined',
        //                 hidden: true,
        //             },
        //             component: () => import(/* webpackChunkName: "object-terminal-info" */ '@/views/object/terminal/info.vue')
        //         },
        //     ]
        // },
        {
            path: 'department',
            name: `${routeName}-department`,
            meta: {
                title: '部门管理',
                icon: 'HomeOutlined'
            },
            component: RouterTransition,
            children: [
                {
                    path: '',
                    name: `${routeName}-department-list`,
                    meta: {
                        title: '部门列表',
                        icon: 'HomeOutlined'
                    },
                    component: () => import(/* webpackChunkName: "object-department-list" */ '@/views/object/department/list.vue')
                },
                {
                    path: ':deptId',
                    name: `${routeName}-department-info`,
                    props: true,
                    meta: {
                        title: '部门详情',
                        hidden: true,
                        icon: 'HomeOutlined'
                    },
                    component: () => import(/* webpackChunkName: "object-department-info" */ '@/views/object/department/info.vue')
                },
            ]
        },
        {
            path: 'role',
            name: `${routeName}-role`,
            meta: {
                title: '角色管理',
                icon: 'UserOutlined'
            },
            component: RouterTransition,
            children: [
                {
                    path: '',
                    name: `${routeName}-role-list`,
                    meta: {
                        title: '角色列表',
                        icon: 'HomeOutlined'
                    },
                    component: () => import(/* webpackChunkName: "object-role-list" */ '@/views/object/role/list.vue')
                },
                {
                    path: ':id',
                    name: `${routeName}-role-info`,
                    props: true,
                    meta: {
                        title: '角色详情',
                        hidden: true,
                        icon: 'HomeOutlined'
                    },
                    component: () => import(/* webpackChunkName: "object-role-user" */ '@/components/user/index.vue')
                },
            ]
        },
        {
            path: 'jenkins',
            name: `${routeName}-jenkins`,
            meta: {
                title: 'jenkins列表',
                icon: 'RobotFilled'
            },
            component: RouterTransition,
            children: [
                {
                    path: '',
                    name: `${routeName}-jenkins-list`,
                    meta: {
                        title: 'jenkins列表',
                        icon: 'HomeOutlined'
                    },
                    component: () => import('@/views/object/jenkins/list.vue')
                },
                {
                    path: ':id',
                    name: `${routeName}-jenkins-info`,
                    props: true,
                    meta: {
                        title: '任务详情',
                        icon: 'HomeOutlined',
                        hidden: true,
                    },
                    component: () => import(/* webpackChunkName: "object-jenkins-info" */ '@/views/object/jenkins/info.vue')
                },
            ]
        },
    ]
}]

export default routes
