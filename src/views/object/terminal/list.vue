<template>
  <split-panel>
    <template v-slot:left-content>
      <dept-tree :hide-operate="true" @selected="selectedTree"/>
    </template>
    <template v-slot:right-content>
      <table-data :selected-dept-id="selectedDeptId" />
    </template>
  </split-panel>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';

import SplitPanel from '@/components/split-panel/index.vue'

import {DeptTree} from "@/components/dept-tree";
import TableData from "./components/table-data.vue";

export default defineComponent({
  name: 'terminal',
  components: {DeptTree, SplitPanel, TableData},
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
