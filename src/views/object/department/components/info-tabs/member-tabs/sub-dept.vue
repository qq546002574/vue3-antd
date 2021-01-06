<template>
  <table-data :selected-dept-id="selectedDeptId"/>
</template>

<script lang="ts">
import {defineComponent, ref, onMounted} from 'vue';

import SplitPanel from '@/components/split-panel/index.vue'

import {DeptTree} from "@/components/dept-tree";
import TableData from "../../table-data.vue";
import {deptInfo} from "@/api/dept";

export default defineComponent({
  name: 'sub-dept',
  components: {DeptTree, SplitPanel, TableData},
  setup(props, {attrs}) {
    const selectedDeptId = ref(attrs.deptId) // 部门ID

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
