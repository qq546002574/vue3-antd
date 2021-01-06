<template>
  <split-panel>
    <template v-slot:left-content>
      <tree-data @selected="selectedTree"/>
    </template>
    <template v-slot:right-content>
      <table-data :selected-dept-id="selectedDeptId" />
    </template>
  </split-panel>
</template>

<script lang="ts">
import {defineComponent, provide, ref} from 'vue';

import SplitPanel from '@/components/split-panel/index.vue'

import TreeData from "./components/tree-data.vue";
import TableData from "./components/table-data.vue";

export default defineComponent({
  name: 'role',
  components: {TreeData, SplitPanel, TableData},
  setup() {
    const selectedDeptId = ref('0') // 部门ID

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
