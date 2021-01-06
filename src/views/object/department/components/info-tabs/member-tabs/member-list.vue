<template>
<table-data :get-data-method="deptUsers" :selected-dept-id="$attrs.deptId" />
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {deptUsers} from '@/api/dept'
import TableData from '@/views/object/role/components/table-data.vue'

export default defineComponent({
  name: "member-list",
  components: {TableData},
  setup(props, {attrs}) {
    return {
      deptUsers
    }
  }
})
</script>

<style scoped>
</style>
