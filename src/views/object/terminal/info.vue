<template>
    <a-card title="客户端详情">
      <a-tabs :animated="false">
        <a-tab-pane key="1" tab="基础信息">
          <base-info v-bind="$props" />
        </a-tab-pane>
        <a-tab-pane key="2" tab="部门信息">
          <dept-info v-bind="$props" />
        </a-tab-pane>
        <a-tab-pane key="3" tab="操作">
          <operate v-bind="$props" />
        </a-tab-pane>
      </a-tabs>
    </a-card>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {Card, Tabs} from 'ant-design-vue'
import {BaseInfo, DeptInfo, Operate} from './components/info-tabs'

export default defineComponent({
  name: "terminal-info",
  props: ['pid'],
  components: {ACard: Card, ATabs: Tabs, ATabPane: Tabs.TabPane, BaseInfo, DeptInfo, Operate},
  setup() {

    return {}
  }
})
</script>

<style lang="scss" scoped>

</style>
