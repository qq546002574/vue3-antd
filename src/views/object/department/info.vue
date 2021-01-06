<template>
  <a-card title="部门详情">
    <a-tabs v-model:activeKey="activeKey" :animated="false">
      <a-tab-pane v-for="tabItem in tabs" :key="tabItem.comName" :tab="tabItem.title">
      </a-tab-pane>
    </a-tabs>
    <component :is="activeKey" v-bind="$props"/>
  </a-card>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue'
import {Card, Tabs} from 'ant-design-vue'
import {BaseInfo, DeptPolicy, MemberInfo, Operate} from './components/info-tabs'

export default defineComponent({
  name: "dept-info",
  props: ['deptId'],
  components: {
    [Card.name]: Card,
    [Tabs.name]: Tabs,
    [Tabs.TabPane.name]: Tabs.TabPane,
    BaseInfo,
    DeptPolicy,
    MemberInfo,
    Operate
  },
  setup() {
    const activeKey = ref(BaseInfo.name)
    const tabs = [
      {
        title: '部门信息',
        comName: BaseInfo.name
      },
      {
        title: '部门策略',
        comName: DeptPolicy.name
      },
      {
        title: '成员组成',
        comName: MemberInfo.name
      },
      {
        title: '操作',
        comName: Operate.name
      }
    ]

    return {
      activeKey,
      tabs
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
