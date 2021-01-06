<template>
  <split-panel>
    <!-- <template v-slot:left-content>
      <dept-tree :hide-operate="true" @selected="selectedTree"/>
    </template> -->
    <template v-slot:right-content>
      <table-data />
    </template>
  </split-panel>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';

import SplitPanel from '@/components/split-panel/index.vue'

import TableData from "./components/table-data.vue";

export default defineComponent({
  name: 'jenkins',
  components: {SplitPanel, TableData},
  setup() {

    return { }
  },
});

</script>

<style>

</style>
