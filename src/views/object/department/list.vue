<template>
  <split-panel>
    <template v-slot:left-content>
      <dept-tree @selected="selectedTree"/>
    </template>
    <template v-slot:right-content>
      <operate-head />
      <table-data :selected-dept-id="selectedDeptId" />
    </template>
  </split-panel>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import SplitPanel from '@/components/split-panel/index.vue'

import {DeptTree} from "@/components/dept-tree";
import TableData from "./components/table-data.vue";
import OperateHead from "./components/operate-head.vue";

export default defineComponent({
  name: 'department',
  components: {DeptTree, SplitPanel, TableData,OperateHead},
  setup() {
    const selectedDeptId = ref('1') // 部门ID

    // 选择的部门id
    const selectedTree = (value) => {
      selectedDeptId.value = value
    }

    return {
      selectedDeptId,
      selectedTree,
    }
  },
});

</script>

<style>

</style>
