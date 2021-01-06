<template>
  <div v-for="tableItem in tables" :key="tableItem.flag">
    <h3 class="table-title">{{ tableItem.title }}</h3>
    <a-table bordered
             :scroll="{y: 'calc(100vh - 210px)'}"
             :columns="columns"
             :loading="loading"
             :pagination="false"
             rowKey="pid"
             :data-source="tableItem.data">
      <template #mac="{text, record}">
        {{ record.pid.slice(-12) }}
      </template>
      <template v-slot:actions="{text, record}">
        <a-space :size="10">
          <router-link :to="`/object/terminal/${record.pid}`">详情</router-link>
          <a-popconfirm
              v-if="tableItem.data.length"
              title="您确定要卸载吗?"
              @confirm="uninstall(record)"
          >
            <a>卸载</a>
          </a-popconfirm>
          <a @click="approve(record, tableItem.flag)">{{ tableItem.flag == 0 ? '取消认证' : '通过认证' }}</a>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, watch, computed} from 'vue';

import {message, Popconfirm as APopconfirm, Space as ASpace} from 'ant-design-vue'

import SplitPanel from '@/components/split-panel/index.vue'

import {clientAll, clientUninstall, clientApprove} from '@/api/client'

const temColumns = [
  {
    title: '序列号',
    dataIndex: 'pid',
  },
  {
    title: 'MAC地址',
    dataIndex: 'mac',
    slots: {customRender: 'mac'}
  },
  {
    title: 'IP',
    dataIndex: 'ip',
  },
  {
    title: '别名',
    dataIndex: 'cname',
  },
  {
    title: '终端版本',
    dataIndex: 'versions',
  },
  {
    title: '操作',
    dataIndex: 'actions',
    fixed: 'right',
    width: 170,
    slots: {customRender: 'actions'}
  }
]

interface ComponentProps {
  selectedDeptId: string | number;
}

export default defineComponent({
  name: 'table-data',
  components: {SplitPanel, APopconfirm, ASpace},
  props: {
    selectedDeptId: {
      type: [String, Number],
      default: 1
    }
  },
  setup(props: ComponentProps) {
    const state = reactive({
      loading: false, // 表格加载状态
      currentPid: 0,
      unApprovedList: [], // 未审批终端
      approvedList: [] // 已审批终端
    })
    const columns: Array<any> = temColumns

    // 审批与未审批上下两个表格
    const tables = computed(() => {
      return [
        {
          title: '已审批终端',
          flag: 0,
          data: state.approvedList
        },
        {
          title: '未审批终端',
          flag: 1,
          data: state.unApprovedList
        }
      ]
    })

    // 获取所有的客户端列表
    const getClient = async (id) => {
      state.loading = true
      const data = await clientAll({deptID: id}).finally(() => state.loading = false)
      state.unApprovedList = data.unApproved
      state.approvedList = data.Approved
    }

    getClient(props.selectedDeptId)

    // 监听点击树传过来的id
    watch(() => props.selectedDeptId, value => {
      console.log(value, '收到了')
      getClient(value)
    })

    // 通过认证
    const approve = async (record, flag) => {
      const res = await clientApprove({flag}, record.pid)
      if (res.code == 1) {
        message.success('操作成功')
        getClient(props.selectedDeptId)
      } else {
        message[res.type](res.message || '操作失败')
      }
    }

    // 卸载
    const uninstall = async (record) => {
      const res = await clientUninstall({}, record.pid)
      if (res.code == 1) {
        message.success('卸载成功')
      } else {
        message[res.type](res.message || '卸载失败')
      }
    }

    return {
      ...toRefs(state),
      columns,
      tables,
      approve,
      uninstall,
    }
  },
});

</script>

<style lang="scss" scoped>
.table-title {
  margin: 0.5em;
}
</style>
