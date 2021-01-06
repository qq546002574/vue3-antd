<template>
  <div class="tree-wrapper">
    <a-tree
        blockNode
        v-model:expanded-keys="expandedKeys"
        :auto-expand-parent="autoExpandParent"
        :defaultSelectedKeys="selectedKeys"
        :loadedKeys="loadedKeys"
        :tree-data="treeData"
        :load-data="onLoadData"
        @expand="onExpand"
        @select="onSelect"
    >
      <template v-slot:title="node">
        {{ node.title }}
        <operate-row v-if="!hideOperate" @delete="deleteRow(node)" :hide-del="getPosLength(node) < 3" :hide-edit="true" @add="addRow(node)"
                     @edit="editRow(node)"/>
      </template>
    </a-tree>
  </div>
</template>

<script lang="ts">
import {message, Tree} from 'ant-design-vue'
import {defineComponent, toRefs, SetupContext, reactive, onMounted, nextTick, unref} from 'vue'
import {useDeptNew} from './modals/useModals'
import DeptNew from './modals/dept-new/dept-new.vue'
import {useCreateModal} from "@/hooks/useCreateModal";
import {OperateRow} from '@/components/operate-row'

import {deptDel, deptTree} from '@/api/dept'

import {useEventbus} from "@/hooks/useEventbus";

interface TreeItem {
  title: string | number;
  key: string | number;
  children?: TreeItem[];
  scopedSlots?: object;
  [propName: string]: any;
}

export default defineComponent({
  name: 'dept-tree',
  emits: ['selected'],
  props: {
    hideOperate: { // 隐藏操作栏
      type: Boolean,
      default: false
    },
    rootTreeOption: { // 根树配置
      type: Object,
      default: () => ({
        title: '公司',
        key: '1'
      })
    }
  },
  components: {OperateRow, [Tree.name]: Tree},
  setup(props, context: SetupContext) {
    //事件主线
    const {refreshTree} = useEventbus()

    const state = reactive({
      expandedKeys: [props.rootTreeOption.key],
      autoExpandParent: true,
      loadedKeys: [],
      checkedKeys: [],
      selectedKeys: [props.rootTreeOption.key],
      treeData: [
        {
          title: '公司',
          key: '1',
          scopedSlots: {title: 'title'},
          isLeaf: false,
          children: [],
          ...props.rootTreeOption
        }
      ],
    })

    // 获取部门树
    const getDeptTree = async (fatherId: string | number) => {
      const param = {
        ID: fatherId
      }
      const data = await deptTree(param)
      return data.filter(n => n.id != 1).map(item => {
        return {
          title: item.dname.toString(),
          key: item.id.toString(),
          scopedSlots: {title: 'title'},
          treeInfo: item
        }
      })
    }

    // 初始化树
    const initDeptTree = async () => {
      // state.loadedKeys = []
      state.treeData[0].children = await getDeptTree(state.treeData[0].key)
      // state.expandedKeys = [props.rootTreeOption.key]
      // state.autoExpandParent = false
      // state.checkedKeys = []
      // state.selectedKeys = [props.rootTreeOption.key]
    }

    onMounted(() => {
      refreshTree(() => {
        // todo
        // router.push({
        //   path: '/redirect' + unref(route).fullPath,
        // })
        initDeptTree()
      })
      initDeptTree()
    })

    const onLoadData = (treeNode) => {
      return new Promise(resolve => {
        if (treeNode.dataRef.children) {
          treeNode.dataRef.isLeaf = true
          console.log(treeNode.dataRef.children, '加载部门树')
          resolve();
          return;
        }
        (async () => {
          // treeNode.vcTreeNode.dataRef.isLeaf = false
          treeNode.dataRef.isLeaf = true
          treeNode.dataRef.children = await getDeptTree(treeNode.eventKey).finally(() => resolve())
          nextTick(() => treeNode.dataRef.isLeaf = false)
          return resolve();
        })()
        // state.treeData = [...state.treeData];
      });
    }

    const onExpand = (expandedKeys: any) => {
      console.log('onExpand', expandedKeys);
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      state.expandedKeys = expandedKeys;
      state.autoExpandParent = false;
    }
    const onCheck = (checkedKeys: any) => {
      console.log('onCheck', checkedKeys);
      state.checkedKeys = checkedKeys;
    }
    const onSelect = (selectedKeys: any, info: any) => {
      const {node} = info
      context.emit('selected', node.eventKey.toString())
      state.selectedKeys = selectedKeys;
    }
    // 获取节点层级
    const getPosLength = (node): number => node.pos.split('-').length

    // 删除行
    const deleteRow = async (node) => {
      const res = await deptDel({deptID: node.eventKey})
      if (res.code == 1) {
        message.success('删除成功')
        initDeptTree()
      } else {
        message[res.type](res.message || '删除失败')
      }
    }
    // 添加行
    const addRow = (node) => {
      // useCreateModal(DeptNew, {fatherId: node.eventKey})
      useDeptNew({fatherId: node.eventKey})
    }
    // 编辑行
    const editRow = (node) => {
      console.log(node)
    }

    return {
      ...toRefs(state),
      onCheck,
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
