<template>
  <a-table
           style="min-height: 215px;border-bottom: 1px solid #f0f0f0;"
           :bordered="true"
           size="middle"
           :pagination="false"
           :scroll="{y: 200}"
           :customRow="customRow"
           :columns="columns"
           :loading="loading"
           rowKey="processid"
           :data-source="dataList">
    <template v-slot:options="{text, record}">
      <span>{{ formatOptions(record) }}</span>
    </template>
  </a-table>
  <edit-form :processid="processid" :disabled="!isSelectedTableItem" @edit-row="editRow" @delete-row="deleteRow" @add-row="addRow" v-bind="$attrs"/>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, watch} from 'vue';

import EditForm from './edit-form.vue'

import {appBymodule, appProc} from '@/api/policy'
import {formatOptions} from './utils'

const temColumns = [
  {
    title: '进程名',
    dataIndex: 'processname',
    key: 'processname',
    scopedSlots: {customRender: 'processname'}
  },
  {
    title: '扩展名',
    dataIndex: 'externname',
    key: 'externname'
  },
  {
    title: '策略选项',
    dataIndex: 'options',
    key: 'options',
    slots: {customRender: 'options'}
  }
]

interface ComponentProps {
  selectedId: string | number;
}

export default defineComponent({
  name: 'table-data',
  components: {EditForm},
  props: {
    selectedId: {
      type: [String, Number],
      default: ''
    }
  },
  setup(props: ComponentProps) {
    const columns: Array<any> = temColumns
    const state = reactive({
      loading: false,
      processid: '',
      isSelectedTableItem: false,
      dataList: []
    })

    const getAppByModule = async (id) => {
      state.processid = ''
      state.loading = true
      const data = await appBymodule({id}).finally(() => state.loading = false)
        state.dataList = data
    }

    watch(() => props.selectedId,  value => {
      state.loading = true
      console.log(value, '收到了')
      state.isSelectedTableItem = false
      getAppByModule(value)
    })

    const customRow = record => ({
      class: {
        click: state.processid == record.processid
      },
      onclick: async e => {
        e.preventDefault();
        e.stopPropagation()
        state.isSelectedTableItem = true
        console.log(record, '点击的表格')
        state.processid = record.processid
      }
    })

    const addRow = (res: boolean) => {
      if (res) {
        state.processid = ''
        getAppByModule(props.selectedId)
      }
    }

    const deleteRow = (processid) => getAppByModule(props.selectedId)

    const editRow = (processid) => getAppByModule(props.selectedId)

    return {
      ...toRefs(state),
      columns,
      formatOptions,
      customRow,
      deleteRow,
      addRow,
      editRow,
    }
  },
});

</script>

<style lang="scss" scoped>
::v-deep(.click) > td {
  background-color: #e6f7ff;
}
</style>
