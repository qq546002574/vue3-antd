<template>
  <div class="tree-wrapper">
    <a-tree
        blockNode
        :defaultSelectedKeys="selectedKeys"
        v-model:expanded-keys="expandedKeys"
        :auto-expand-parent="autoExpandParent"
        :loadedKeys="loadedKeys"
        :tree-data="treeData"
        @expand="onExpand"
        @select="onSelect"
    >
      <template v-slot:title="node">
        {{ node.title }}
        <operate-row v-if="!hideOperate" @delete="deleteRow(node)" :hide-del="getPosLength(node) < 3" :hide-edit="getPosLength(node) < 3" @add="addRow(node)" @edit="editRow(node)"/>
      </template>
    </a-tree>
  </div>
</template>

<script lang="ts">
import {message, Tree} from 'ant-design-vue'
import {defineComponent, toRefs, SetupContext, reactive, onMounted, unref, nextTick} from 'vue'

import {useDeptNew, useAssignUser} from './modals/useModals'
import {OperateRow} from '@/components/operate-row'

import {watermarkGroup, watermarkDel, watermarkUsers} from '@/api/watermark'
import {useRoute, useRouter} from "vue-router";
import {useEventbus} from "@/hooks/useEventbus";

interface TreeItem {
  title: string | number;
  key: string | number;
  children?: TreeItem[];
  scopedSlots?: object;
  [propName: string]: any;
}

export default defineComponent({
  name: 'watermark-tree',
  emits: ['selected', 'selected-node'],
  props: {
    hideOperate: { // 隐藏操作栏
      type: Boolean,
      default: false
    },
    rootTreeOption: { // 根树配置
      type: Object,
      default: () => ({
        title: '全局组',
        key: '0'
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
      checkedKeys: ['0'],
      selectedKeys: ['0'],
      treeData: [
        {
          title: '全局组',
          key: '0',
          scopedSlots: {title: 'title'},
          isLeaf: false,
          children: [],
          ...props.rootTreeOption
        }
      ],
    })

    // 获取节点层级
    const getPosLength = (node): number => node.pos.split('-').length

    // 获取部门树
    const getDeptTree = async (fatherId: string | number) => {
      const param = {
        gid: fatherId,
        uid: 0
      }
      const data = await watermarkUsers(param)
      return data.map(item => {
        return {
          title: item.groudname.toString(),
          key: item.id.toString(),
          scopedSlots: {title: 'title'}
        }
      })
    }

    // 初始化树
    const initDeptTree = async () => {
      state.loadedKeys = []
      const data = await watermarkGroup({})
      state.treeData[0].children = data.map(item => {
        return {
          title: item.groudname.toString(),
          key: item.id.toString(),
          scopedSlots: {title: 'title'}
        }
      })
      state.expandedKeys = [props.rootTreeOption.key]
      state.autoExpandParent = false
      state.checkedKeys = []
      state.selectedKeys = [props.rootTreeOption.key]
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
          console.log(treeNode.dataRef.children, '加载工作树')
          resolve();
          return;
        }
        (async () => {
          treeNode.dataRef.isLeaf = true
          treeNode.dataRef.children = await getDeptTree(treeNode.eventKey)
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
      context.emit('selected-node', node)
      state.selectedKeys = selectedKeys;
    }

    // 删除行
    const deleteRow = async (node) => {
      const res = await watermarkDel({gid: node.eventKey})
      if (res.code == 1) {
        message.success('删除成功')
        initDeptTree()
      } else {
        message[res.type](res.message || '删除失败')
      }
    }
    // 添加行
    const addRow = (node) => {
      if (getPosLength(node) == 2) {
        useDeptNew({fatherId: node.eventKey})
      } else if (getPosLength(node) == 3) {
        useAssignUser({groupId: node.eventKey, treeTitle: node.dataRef.title})
      }
    }
    // 编辑行
    const editRow = (node) => {
      useDeptNew({fatherId: node.eventKey})
    }

    return {
      ...toRefs(state),
      onCheck,
      onSelect,
      getPosLength,
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
