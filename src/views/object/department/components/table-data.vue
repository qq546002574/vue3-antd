<template>
  <a-table bordered
           :scroll="{y: 'calc(100vh - 210px)'}"
           :columns="columns"
           :loading="loading"
           :pagination="false"
           rowKey="id"
           :data-source="dataList">
    <template #mac="{text, record}">
      {{record.pid.slice(-12)}}
    </template>
    <template v-slot:actions="{text, record}">
      <a-space :size="10">
        <router-link :to="`/object/department/${record.id}`">详情</router-link>
        <a-popconfirm
            v-if="dataList.length"
            title="您确定要删除吗?"
            placement="leftTop"
            @confirm="delDept(record)"
        >
          <a>删除</a>
        </a-popconfirm>
        <a-dropdown>
          <a class="ant-dropdown-link" @click="e => e.preventDefault()">更多<DownOutlined /> </a>
          <template v-slot:overlay>
            <a-menu>
              <a-menu-item>
                <a @click="setApprove(record.id, 1)">部门设置自动审批</a>
              </a-menu-item>
              <a-menu-item>
                <a @click="setApprove(record.id, 0)">部门设置手动审批</a>
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </a-space>
    </template>
  </a-table>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, watch, onMounted} from 'vue';

import {message, Popconfirm , Space, Dropdown} from 'ant-design-vue'
import {DownOutlined} from '@ant-design/icons-vue'

import SplitPanel from '@/components/split-panel/index.vue'

import {useEventbus} from '@/hooks/useEventbus'

import {deptSub,deptDel,DeptSetapprove} from '@/api/dept'

const temColumns = [
  {
    title: '部门',
    dataIndex: 'dname',
  },
  {
    title: '地址',
    dataIndex: 'office',
  },
  {
    title: '电话',
    dataIndex: 'tel',
  },
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',
    width: 150,
    slots: {customRender: 'actions'}
  }
]

interface ComponentProps {
  selectedDeptId: string | number;
}


export default defineComponent({
  name: 'table-data',
  components: {SplitPanel, [Popconfirm.name]: Popconfirm, ASpace: Space, [Dropdown.name]: Dropdown, DownOutlined},
  props: {
    selectedDeptId: {
      type: [String, Number],
      default: 1
    }
  },
  setup(props: ComponentProps) {
    const state = reactive({
      loading: false,
      currentDeptId: 0,
      dataList: [],
    })
    const columns: Array<any> = temColumns

    const {refreshTable} = useEventbus()

    const getTableData = async (id) => {
      state.loading = true
      const data = await deptSub({deptID: id}).finally(() => state.loading = false)
      state.dataList = data.filter(item => item.id != 1)
    }

    onMounted(() => {
      refreshTable(() => getTableData(props.selectedDeptId))
      getTableData(props.selectedDeptId)
    })

    // 监听点击树传过来的id
    watch(() => props.selectedDeptId, value => {
      console.log(value, '收到了')
      getTableData(value)
    })

    // 卸载
    const delDept = async (record) => {
      const res = await deptDel({deptID: record.id})
      if (res.code == 1) {
        message.success('删除成功')
        getTableData(props.selectedDeptId)
      } else {
        message[res.type](res.message || '删除失败')
      }
    }

    // 部门设置审批
    const setApprove = async (deptID, value) => {
      const result = await DeptSetapprove({deptID,value})
      if (result.code == 1) {
        message.success('设置成功')
      } else {
        message[result.type](result.message || '设置失败')
      }
    }

    return {
      ...toRefs(state),
      columns,
      setApprove,
      delDept,
    }
  },
});

</script>

<style lang="scss" scoped>
.table-title {
  margin: 0.5em;
}
</style>
