<template>
  <div class="tree-wrapper">
    <a-tree
        blockNode
        v-model:expanded-keys="expandedKeys"
        :auto-expand-parent="autoExpandParent"
        :tree-data="treeData"
        :loadedKeys="loadedKeys"
        :load-data="onLoadData"
        @expand="onExpand"
        @select="onSelect"
    >
      <template v-slot:title="node">
        {{ node.title }}
        <operate-row
            :hide-edit="getPosLength(node) < 3"
            :hide-del="getPosLength(node) < 3"
            :hide-add="getPosLength(node) > 3"
            @delete="deleteRow(node)"
            @add="addRow(node)"
            @edit="editRow(node)"/>
      </template>
    </a-tree>
  </div>
</template>

<script lang="ts">
import {message, Tree} from 'ant-design-vue'
import {defineComponent, toRefs, SetupContext, reactive, onMounted, nextTick} from 'vue'
import {OperateRow} from '@/components/operate-row'

import {usePolicyOperation} from "@/views/tactics/template/modals/useModals"
import {
  policyAdd,
  policySet,
  moduleAdd,
  moduleSet,
  moduleDel,
  policyDel,
  moduleBypolicy,
  policyAll
} from '@/api/policy'

interface TreeItem {
  title: string | number;
  key: string | number;
  children?: TreeItem[];
  scopedSlots?: object;

  [propName: string]: any;
}

export default defineComponent({
  name: 'tree-data',
  components: {OperateRow, [Tree.name]: Tree},
  emits: ['selected-node', 'selected'],
  setup(props, context: SetupContext) {
    const state = reactive({
      expandedKeys: ['0'],
      autoExpandParent: true,
      selectedKeys: [] as string[] | number[],
      loadedKeys: [],
      treeData: [
        {
          title: '策略配置',
          key: '0',
          scopedSlots: {title: 'title'},
          children: []
        }
      ],
    })

    // 获取树key
    const getKey = (key) => key.replace(/classid-|appid-/g, '')

    // 获取部门树
    const getDeptTree = async (fatherId: string | number) => {
      const param = {
        id: getKey(fatherId)
      }
      const data = await moduleBypolicy(param)
      return data.filter(n => n.id != 1).map(item => {
        return {
          title: item.applicationname,
          key: 'appid-' + item.applicationid,
          scopedSlots: {title: 'title'},
          isLeaf: true,
          ...item
        }
      }) || []
    }

    // 获取策略树
    const getPolicyTree = async () => {
      const data = await policyAll({})
      state.treeData[0].children = data.map(item => {
        return {
          title: item.classname,
          key: 'classid-' + item.classid,
          scopedSlots: {title: 'title'},
          ...item
        } as TreeItem
      })

      // for (const item of children) {
      //   item.children = await getDeptTree(item.key)
      // }
    }

    // 加载树节点
    const onLoadData = (treeNode) => {
      console.log(treeNode, '节点')
      return new Promise(resolve => {
        if (treeNode.dataRef.children) {
          treeNode.dataRef.isLeaf = true
          resolve();
          return;
        }
        (async () => {
          treeNode.dataRef.children = await getDeptTree(getKey(treeNode.eventKey))
          resolve();
        })()
        // state.treeData = [...state.treeData];
      });
    }

    // 初始化数据
    const initData = () => {
      getPolicyTree()
    }

    onMounted(() => {
      initData()
    })

    // 获取节点层级
    const getPosLength = (node): number => node.pos.split('-').length

    const onExpand = (expandedKeys: any) => {
      console.log('onExpand', expandedKeys);
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      state.expandedKeys = expandedKeys;
      state.autoExpandParent = false;
    }
    const onSelect = (selectedKeys: any, info: any) => {
      console.log('onSelect', info)
      const {node} = info
      const posLength = getPosLength(node)
      posLength > 3 && context.emit('selected', getKey(node.eventKey.toString()))
      context.emit('selected-node', node)
      state.selectedKeys = selectedKeys;
    }

    // 删除行
    const deleteRow = async (node) => {
      const pos = getPosLength(node) - 1
      if (pos == 2) {
        const result = await policyDel({id: getKey(node.eventKey)})
        if (result.code == 1) {
          initData()
          message.success('删除成功')
        } else {
          message[result.type](result.message || '删除失败')
        }
      } else if (pos >= 3) {
        const result = await moduleDel({id: getKey(node.eventKey)})
        if (result.code == 1) {
          initData()
          message.success('删除成功')
        } else {
          message[result.type](result.message || '删除失败')
        }
      }
    }
    // 添加行
    const addRow = (node) => {
      const pos = getPosLength(node) - 1
      console.log(pos, '长度')

      if (pos == 1) {
        usePolicyOperation({
          title: '策略名称',
          label: '策略名称',
          reqMethod: policyAdd,
          callback: (res: any): void => {
            if (res.code == 1) initData()
          }
        })
      } else if (pos == 2) {
        usePolicyOperation({
          title: '加密类型',
          id: getKey(node.eventKey),
          label: '类型名称',
          reqMethod: moduleAdd,
          callback: (res: any): void => {
            if (res.code == 1) initData()
          }
        })
      }
    }
    // 编辑行
    const editRow = (node) => {
      const pos = getPosLength(node) - 1
      if (pos == 2) {
        usePolicyOperation({
          title: '策略名称',
          id: getKey(node.eventKey),
          defaultValue: node.title,
          label: '策略名称',
          reqMethod: policySet,
          callback: (res: any): void => {
            if (res.code == 1) initData()
          }
        })
      } else if (pos == 3) {
        usePolicyOperation({
          title: '加密分类',
          id: getKey(node.eventKey),
          defaultValue: node.title,
          label: '类型名称',
          reqMethod: moduleSet,
          callback: (res: any): void => {
            if (res.code == 1) initData()
          }
        })
      }
    }

    return {
      ...toRefs(state),
      getPosLength,
      onSelect,
      onExpand,
      onLoadData,
      deleteRow,
      addRow,
      editRow
    };
  }
})
</script>

<style lang="scss" scoped>
.tree-wrapper {
  overflow: auto;

  ::v-deep(.ant-tree-title) {
    display: inline-block;
    width: 100%;

    &:hover .actions {
      display: inline-block;
    }
  }
}
</style>
