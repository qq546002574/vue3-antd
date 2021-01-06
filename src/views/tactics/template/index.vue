<template>
  <split-panel>
    <template v-slot:left-content>
      <tree-data @selected="selectedTree" @selected-node="selectedNode"/>
    </template>
    <template v-slot:right-content>
      <table-data :selected-id="selectedId" :selected-names="selectedNames" />
    </template>
  </split-panel>
</template>

<script lang="ts">
import {defineComponent, ref, toRefs, reactive} from 'vue';

import SplitPanel from '@/components/split-panel/index.vue'

import TreeData from "./components/tree-data.vue";
import TableData from "./components/table-data.vue";

export default defineComponent({
  name: 'terminal',
  components: {TreeData, SplitPanel, TableData},
  setup() {
    const selectedId = ref('') // 策略ID
    const state = reactive({
      selectedNames: {
        name: '',
        type: '',
        applicationid: ''
      }
    })

    // 选择的部门id
    const selectedTree = (value) => {
      selectedId.value = value
    }
    // 选择的部门树
    const selectedNode = (node) => {
      const posLength = node.pos.split('-').length
      if (posLength > 3) {
        state.selectedNames = {
          name: node.vcTreeNode.dataRef.title,
          type: node.dataRef.title,
          applicationid: node.dataRef.applicationid
        }
      } else if (posLength > 2) {
        state.selectedNames = {
          name: node.dataRef.title,
          type: '',
          applicationid: node.dataRef.applicationid
        }
      }
    }

    return {
      ...toRefs(state),
      selectedId,
      selectedTree,
      selectedNode,
    }
  },
});

</script>

<style>

</style>
