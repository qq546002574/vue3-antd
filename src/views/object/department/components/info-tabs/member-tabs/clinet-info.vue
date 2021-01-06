<template>
  <split-panel>
    <template v-slot:left-content>
      <dept-tree v-if="treeOption.key" :hide-operate="true" :root-tree-option="treeOption" @selected="selectedTree"/>
    </template>
    <template v-slot:right-content>
      <table-data :selected-dept-id="selectedDeptId" />
    </template>
  </split-panel>
</template>

<script lang="ts">
import {defineComponent, onMounted, ref} from 'vue';

import SplitPanel from '@/components/split-panel/index.vue'

import {DeptTree} from "@/components/dept-tree";
import TableData from "@/views/object/terminal/components/table-data.vue";
import {deptInfo} from "@/api/dept";

export default defineComponent({
  name: 'client-info',
  components: {DeptTree, SplitPanel, TableData},
   setup(props, {attrs}) {
    const selectedDeptId = ref(attrs.deptId) // 部门ID
     const treeOption = ref({
       title: '',
       key: ''
     })

     onMounted(async () => {
       const {dname, id} = await deptInfo({}, attrs.deptId)

       treeOption.value = {
         title: dname,
         key: id
       }
     })

    // 选择的部门id
    const selectedTree = (value) => {
      selectedDeptId.value = value
    }

    return {
      selectedDeptId,
      treeOption,
      selectedTree,
    }
  },
});

</script>

<style>

</style>
