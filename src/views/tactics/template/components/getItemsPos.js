import {useDeptNew, usePolicyOperation} from "@/views/tactics/template/modals/useModals"
import {policyAdd, policySet, moduleAdd, moduleSet, appDel, moduleDel, policyDel} from '@/api/policy'
import {message} from "ant-design-vue";

export const getItemsPos = (node, callback) => {
    return {
        1: [
            {
                icon: 'redo',
                label: '新建策略名称',
                handler: (item) => {
                    usePolicyOperation({title: '策略名称', label: '策略名称', reqMethod: policyAdd, callback})
                },
            },
            {
                icon: 'redo',
                label: '模板导出',
                handler: (item) => {
                    useDeptNew({fatherId: node.eventKey})
                },
            },
            {
                icon: 'redo',
                label: '模板导入',
                handler: (item) => {
                    useDeptNew({fatherId: node.eventKey})
                },
            }
        ],
        2: [
            {
                icon: 'redo',
                label: '新建加密类型',
                handler: (item) => {
                    usePolicyOperation({
                        title: '加密类型',
                        id: node.eventKey,
                        label: '类型名称',
                        reqMethod: moduleAdd,
                        callback
                    })
                },
            },
            {
                icon: 'redo',
                label: '删除策略名称',
                handler: async (item) => {
                    const data = await policyDel({id: node.eventKey})
                        const children = node.vcTreeNode.dataRef.children
                        node.vcTreeNode.dataRef.children = children.filter(n => n.key != node.eventKey)
                        message.success('删除成功')
                },
            },
            {
                icon: 'redo',
                label: '修改策略名称',
                handler: (item) => {
                    usePolicyOperation({
                        title: '策略名称',
                        id: node.eventKey,
                        label: '策略名称',
                        reqMethod: policySet,
                        callback
                    }, (name) => {
                        node.dataRef.title = name
                    })
                },
            },
            {
                icon: 'redo',
                label: '模板导出',
                handler: (item) => {
                    useDeptNew({fatherId: node.eventKey})
                },
            },
            {
                icon: 'redo',
                label: '模板导入',
                handler: (item) => {
                    useDeptNew({fatherId: node.eventKey})
                },
            }
        ],
        3: [
            {
                icon: 'redo',
                label: '删除加密类型',
                handler: async (item) => {
                    console.log(node)
                    const result = await moduleDel({id: node.eventKey})
                    const children = node.vcTreeNode.dataRef.children
                    console.log(children)
                    node.vcTreeNode.dataRef.children = children.filter(n => n.key != node.eventKey)
                },
            },
            {
                icon: 'redo',
                label: '修改类型名称',
                handler: (item) => {
                    usePolicyOperation({
                        title: '加密分类',
                        id: node.eventKey,
                        label: '类型名称',
                        reqMethod: moduleSet,
                        callback
                    }, (name) => {
                        node.dataRef.title = name
                    })
                },
            },
            {
                icon: 'redo',
                label: '模板导出',
                handler: (item) => {
                    useDeptNew({fatherId: node.eventKey})
                },
            },
            {
                icon: 'redo',
                label: '模板导入',
                handler: (item) => {
                    useDeptNew({fatherId: node.eventKey})
                },
            }
        ]
    }[node.pos.split('-').length - 1]
}
