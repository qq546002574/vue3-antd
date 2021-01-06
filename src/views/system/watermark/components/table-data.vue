<template>
  <a-table bordered
           size="middle"
           :scroll="{y: 'calc(100vh - 210px - var(--table-height))'}"
           :columns="columns"
           :loading="loading"
           :pagination="false"
           :customRow="customRow"
           rowKey="id"
           :data-source="dataList">
    <template #mac="{text, record}">
      {{record.pid.slice(-12)}}
    </template>
    <template v-slot:actions="{text, record}">
      <a-space :size="10">
        <a-popconfirm
            v-if="dataList.length"
            title="您确定要将该用户从组中移除吗?"
            placement="leftTop"
            @confirm="delDept(record)"
        >
          <a>删除</a>
        </a-popconfirm>
      </a-space>
    </template>
  </a-table>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, watch, onMounted} from 'vue';

import {message, Popconfirm , Space} from 'ant-design-vue'

import SplitPanel from '@/components/split-panel/index.vue'

import {useEventbus} from '@/hooks/useEventbus'

import {watermarkUsers, watermarkRemove} from '@/api/watermark'

const temColumns = [
  {
    title: '用户',
    dataIndex: 'username',
  },
  {
    title: '姓名',
    dataIndex: 'cname',
  },
  {
    title: '所属部门',
    dataIndex: 'userpri',
  },
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',
    width: 60,
    slots: {customRender: 'actions'}
  }
]

interface ComponentProps {
  selectedDeptId: string | number;
}


export default defineComponent({
  name: 'table-data',
  components: {SplitPanel, [Popconfirm.name]: Popconfirm, ASpace: Space},
  emits: ['selected'],
  props: {
    selectedDeptId: {
      type: [String, Number],
      default: 1
    }
  },
  setup(props: ComponentProps, {emit}) {
    const state = reactive({
      loading: false,
      currentId: -99,
      dataList: [],
    })
    const columns: Array<any> = temColumns

    const {refreshTable} = useEventbus()

    const getTableData = async (id) => {
      state.loading = true
      const data = await watermarkUsers({gid: id}).finally(() => state.loading = false)
      state.dataList = data
    }

    onMounted(() => {
      refreshTable(() => getTableData(props.selectedDeptId))
      getTableData(props.selectedDeptId)
    })

    // 监听点击树传过来的id
    watch(() => props.selectedDeptId, value => {
      console.log(value, '收到了')
      state.currentId = -99
      getTableData(value)
    })

    // 卸载
    const delDept = async (record) => {
      const res = await watermarkRemove({uid: record.id})
      if (res.code == 1) {
        message.success('删除成功')
        getTableData(props.selectedDeptId)
      } else {
        message[res.type](res.message || '删除失败')
      }
    }

    const customRow = record => ({
      class: {
        click: state.currentId == record.id
      },
      onclick: async e => {
        e.preventDefault();
        e.stopPropagation()
        state.currentId = record.id
        emit('selected', record)
      }
    })

    return {
      ...toRefs(state),
      customRow,
      columns,
      delDept,
    }
  },
});

</script>

<style lang="scss" scoped>
.table-title {
  margin: 0.5em;
}
::v-deep(.click) > td {
  background-color: #e6f7ff;
}
</style>
