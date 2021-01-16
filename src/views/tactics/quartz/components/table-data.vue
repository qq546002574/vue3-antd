<template>
  <div v-for="tableItem in tables" :key="tableItem.flag">
    <h3 class="table-title">{{ tableItem.title }}</h3>
    <a-button :loading="loading" type="primary">
      <router-link to="/tactics/quartz/add">新增</router-link>
    </a-button>
    <a-button :loading="loading" type="primary" style="margin-left: 10px;">
      <router-link to="/tactics/quartz/add">quartz任务定时设置</router-link>
    </a-button>
    <a-table bordered
             :scroll="{y: 'calc(100vh - 210px)'}"
             :columns="columns"
             :loading="loading"
             :pagination="false"
             rowKey="pid"
             :data-source="tableItem.data">
      <template v-slot:actions="{text, record}">
        <a-space :size="10">
          <router-link :to="`/tactics/quartz/${record.jobId}`">修改</router-link>
          <a-popconfirm
              v-if="tableItem.data.length"
              title="您确定要删除吗?"
              @confirm="uninstall(record)"
          >
            <a>删除</a>
          </a-popconfirm>
          <a v-if="record.jobStatus == 0" @click="resume(record)">启动</a>
          <a v-if="record.jobStatus == 1" @click="pause(record)">停止</a>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, watch, computed} from 'vue';

import {message, Popconfirm as APopconfirm, Space as ASpace} from 'ant-design-vue'

import SplitPanel from '@/components/split-panel/index.vue'

import {OperateRow} from '@/components/operate-row'

import {quartzAll, addQuartz, delQuartz, pauseQuartz, resumeQuartz} from '@/api/quartz'

const temColumns = [
  {
    title: '序号',
    dataIndex: 'jobId',
  },
  {
    title: '任务名称',
    dataIndex: 'jobName',
    slots: {customRender: 'mac'}
  },
  {
    title: '任务类',
    dataIndex: 'jobClass',
  },
  {
    title: '任务组',
    dataIndex: 'jobGroup',
  },
  {
    title: '任务表达式',
    dataIndex: 'cronExpr',
  },
  {
    title: '任务状态',
    dataIndex: 'jobStatus',
  },
  {
    title: '任务创建时间',
    dataIndex: 'startTime',
  },
  {
    title: '触发组名',
    dataIndex: 'triggerGroupName',
  },
  {
    title: '触发器',
    dataIndex: 'triggerName',
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
      approvedList: [] // quartz列表
    })
    const columns: Array<any> = temColumns

    // 审批与未审批上下两个表格
    const tables = computed(() => {
      return [
        {
          title: 'quartz列表',
          data: state.approvedList
        },
      ]
    })

    // 获取所有的客户端列表
    const getJenkinsAll = async () => {
      state.loading = true
      const data = await quartzAll({}).finally(() => state.loading = false)
      console.log(data);
      state.approvedList = data
    }

    getJenkinsAll()

    // 监听点击树传过来的id
    watch(() => props.selectedDeptId, value => {
      console.log(value, '收到了')
      getJenkinsAll()
    })

    // 暂停
    const pause = async (record) => {
      record.jobStatus = 0;
      const res = await pauseQuartz(record)
      if (res.code == 1) {
        message.success('暂停成功')
      } else {
        record.jobStatus = 1;
        message[res.type](res.message || '暂停失败')
      }
      getJenkinsAll();
    }
   

    // 继续
    const resume = async (record) => {
      record.jobStatus = 1;
      const res = await resumeQuartz(record)
      if (res.code == 1) {
        message.success('恢复成功')
      } else {
        record.jobStatus = 0;
        message[res.type](res.message || '恢复失败')
      }
      getJenkinsAll();
    }

    

    

    // 执行
    // const add = async (record, flag) => {
    //   const res = await addJenkins({flag}, record.id)
    //   if (res.code == 1) {
    //     message.success('操作成功')
    //   } else {
    //     message[res.type](res.message || '操作失败')
    //   }
    // }

    // 卸载
    const uninstall = async (record) => {
      const res = await delQuartz(record)
      if (res.code == 1) {
        message.success('删除成功')
      } else {
        message[res.type](res.message || '删除失败')
      }
      getJenkinsAll()
    }

    return {
      ...toRefs(state),
      columns,
      tables,
      resume,
      pause,
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
