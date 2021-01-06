<template>
  <a-tabs v-model:activeKey="activeKey" :animated="false">
    <a-tab-pane v-for="tabItem in tabs" :key="tabItem.comName" :tab="tabItem.title">
    </a-tab-pane>
  </a-tabs>
  <component :is="activeKey" v-bind="$attrs" />
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue'
import {Card, Tabs} from 'ant-design-vue'
import {SubDept,ClientInfo, MemberList} from './member-tabs'

export default defineComponent({
  name: "member-info",
  components: {[Card.name]: Card, [Tabs.name]: Tabs, [Tabs.TabPane.name]: Tabs.TabPane, SubDept, ClientInfo, MemberList},
  setup(props, {attrs}) {
    const activeKey = ref(SubDept.name)
    const tabs = [
      {
        title: '子部门',
        comName: SubDept.name
      },
      {
        title: '客户端',
        comName: ClientInfo.name
      },
      {
        title: '用户',
        comName: MemberList.name
      }
    ]
    console.log(attrs)
    return {
      activeKey,
      tabs
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
