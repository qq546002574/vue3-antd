<template>
  <div v-for="tableItem in tables" :key="tableItem.flag">
    <h3 class="table-title">{{ tableItem.title }}</h3>
    <a-button :loading="loading" type="primary">
      <router-link to="/object/jenkins/add">新增</router-link>
    </a-button>
    <a-button :loading="loading" type="primary" style="margin-left: 10px;">
      <router-link to="/object/jenkins/add">jenkins任务定时设置</router-link>
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
          <router-link :to="`/object/jenkins/${record.id}`">修改</router-link>
          <a-popconfirm
              v-if="tableItem.data.length"
              title="您确定要删除吗?"
              @confirm="uninstall(record)"
          >
            <a>删除</a>
          </a-popconfirm>
          <a @click="approve(record, tableItem.flag)">{{ tableItem.flag == 0 ? '启动' : '停止' }}</a>
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

import {jenkinsAll, jenkinsDo, delJenkins} from '@/api/jenkins'

const temColumns = [
  {
    title: '序号',
    dataIndex: 'id',
  },
  {
    title: '任务名称',
    dataIndex: 'jobCurrentName',
    slots: {customRender: 'mac'}
  },
  {
    title: 'tomcat名称',
    dataIndex: 'tomcatInstanceName',
  },
  {
    title: 'jenkins环境项目名',
    dataIndex: 'jobPlace',
  },
  {
    title: 'Maven打包后的jar名称',
    dataIndex: 'warName',
  },
  {
    title: '部署环境',
    dataIndex: 'deployType',
  },
  {
    title: '打包方式',
    dataIndex: 'packageWay',
  },
  {
    title: '分支名称',
    dataIndex: 'deployBranch',
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
      approvedList: [] // jenkins列表
    })
    const columns: Array<any> = temColumns

    // 审批与未审批上下两个表格
    const tables = computed(() => {
      return [
        {
          title: 'jenkins列表',
          flag: 0,
          data: state.approvedList
        },
      ]
    })

    // 获取所有的客户端列表
    const getJenkinsAll = async () => {
      state.loading = true
      const data = await jenkinsAll({}).finally(() => state.loading = false)
      console.log(data);
      state.approvedList = data
    }

    getJenkinsAll()

    // 监听点击树传过来的id
    watch(() => props.selectedDeptId, value => {
      console.log(value, '收到了')
      getJenkinsAll()
    })

    // 执行
    const approve = async (record, flag) => {
      const res = await jenkinsDo({flag}, record.id)
      if (res.code == 1) {
        message.success('操作成功')
      } else {
        message[res.type](res.message || '操作失败')
      }
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
      const res = await delJenkins({}, record.id)
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
