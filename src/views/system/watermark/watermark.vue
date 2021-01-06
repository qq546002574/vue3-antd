<template>
  <split-panel>
    <template v-slot:left-content>
      <watermark-tree @selected="selectedTree" @selected-node="selectedNode"/>
    </template>
    <template v-slot:right-content>
      <div class="right-content">
        <table-data :selected-dept-id="selectedDeptId" @selected="tableRowSelected" />
        <watermark-info :gid="selectedDeptId" :uid="uid" :tree-title="treeTitle" :table-title="tableTitle" />
      </div>
    </template>
  </split-panel>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs} from 'vue';

import SplitPanel from '@/components/split-panel/index.vue'

import {WatermarkTree} from "@/components/water-tree";
import {TableData, WatermarkInfo }from './components'

export default defineComponent({
  name: 'watermark',
  components: {WatermarkTree, SplitPanel, TableData, WatermarkInfo},
  setup() {
    const state = reactive({
      selectedDeptId: '0',
      treeTitle: '全局组',
      tableTitle: '',
      uid: 0
    })

    // 选择的水印组id
    const selectedTree = (value) => {
      state.uid = 0
      state.selectedDeptId = value
      state.tableTitle = ''
    }

    const selectedNode = (node) => {
      console.log(node, '选择的树节点')
      state.treeTitle = node.dataRef.title
    }

    // 表格选中的行
    const tableRowSelected = (record) => {
      state.tableTitle = record.username
      state.uid = record.id
    }

    return {
      ...toRefs(state),
      tableRowSelected,
      selectedTree,
      selectedNode
    }
  },
});

</script>

<style lang="scss" scoped>
.right-content {
  display: flex;
  --table-height: 0px;
  height: 100%;
  > * {
    flex: 1;
  }
}
@media (max-width: 1340px) {
  .right-content {
    flex-direction: column;
    --table-height: 430px;
  }
}
</style>
