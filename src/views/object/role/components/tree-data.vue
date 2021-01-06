<template>
  <div class="tree-wrapper">
    <a-tree
        block-node
        :defaultSelectedKeys="selectedKeys"
        :tree-data="treeData"
        @select="onSelect"
    >
      <template v-slot:title="node">
        <span>{{ node.title }}</span>
        <operate-row hide-edit hide-del @add="addRow(node)">
          <template v-slot:before>
            <user-policy-button />
          </template>
        </operate-row>
      </template>
    </a-tree>
  </div>
</template>

<script lang="ts">
import {Tree} from 'ant-design-vue'
import {defineComponent, toRefs, SetupContext, reactive} from 'vue'
import {OperateRow} from '@/components/operate-row'
import {useEventbus} from "@/hooks/useEventbus";
import {useUserAdd} from '../modals/useModals'
import UserPolicyButton from './user-policy-button.vue'

interface TreeItem {
  title: string | number;
  key: string | number;
  children?: TreeItem[];
  scopedSlots?: object;
  [propName: string]: any;
}

export default defineComponent({
  name: 'tree-data',
  components: {[Tree.name]: Tree, OperateRow, UserPolicyButton},
  emits: ['selected'],
  setup(props, context: SetupContext) {
    const {refreshTree} = useEventbus()
    const state = reactive({
      selectedKeys: ['0'],
      treeData: [
        {
          title: '全部用户',
          key: '0',
          scopedSlots: {title: 'title'},
        },
        {
          title: '普通用户',
          key: '1',
          scopedSlots: {title: 'title'},
        },
        {
          title: '控制台管理员',
          key: '2',
          scopedSlots: {title: 'title'},
        },
        {
          title: '分级管理员',
          key: '4',
          scopedSlots: {title: 'title'},
        },
        {
          title: '特权用户',
          key: '8',
          scopedSlots: {title: 'title'},
        }
      ],
    })

    const onSelect = (selectedKeys: any, info: any) => {
      const {node} = info
      context.emit('selected', node.eventKey.toString())
      state.selectedKeys = selectedKeys;
    }
    const getParentKey = (key: any, tree: any): any => {
      let parentKey;
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i];
        if (node.children) {
          if (node.children.some((item: any) => item.key === key)) {
            parentKey = node.key;
          } else if (getParentKey(key, node.children)) {
            parentKey = getParentKey(key, node.children);
          }
        }
      }
      return parentKey;
    }

    const addRow = (node) => {
      useUserAdd({fatherId: node.eventKey})
    }

    return {
      ...toRefs(state),
      addRow,
      onSelect,
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
