<template>
  <a-card title="角色详情">
      <a-tabs v-model:activeKey="activeKey" :animated="false">
        <a-tab-pane v-for="tabItem in tabs" :key="tabItem.comName" :tab="tabItem.title">
        </a-tab-pane>
      </a-tabs>
    <component :is="activeKey" v-bind="$props" />
  </a-card>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue'
import {Card, Tabs} from 'ant-design-vue'
import {BaseInfo} from './info-tabs'

export default defineComponent({
  name: "user-info",
  props: ['id'],
  components: {[Card.name]: Card, [Tabs.name]: Tabs, [Tabs.TabPane.name]: Tabs.TabPane, BaseInfo},
  setup() {
    const activeKey = ref(BaseInfo.name)
    const tabs = [
      {
        title: '基础信息',
        comName: BaseInfo.name
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
