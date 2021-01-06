<template>
    <a-card title="任务详情">
      <a-button :loading="loading" type="primary" class="backBtn">
        <router-link to="/object/jenkins" >返回</router-link>
      </a-button>
      <a-tabs :animated="false">
        <a-tab-pane key="1" tab="任务详情">
          <base-info v-bind="$props" />
        </a-tab-pane>
        <!-- <a-tab-pane key="2" tab="任务名称">
          <dept-info v-bind="$props" />
        </a-tab-pane> -->
      </a-tabs>
      
    </a-card>
    
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {Card, Tabs} from 'ant-design-vue'
import {BaseInfo} from './components/info-tabs'

export default defineComponent({
  name: "jenkins-info",
  props: ['id'],
  components: {ACard: Card, ATabs: Tabs, ATabPane: Tabs.TabPane, BaseInfo},
  setup() {

    return { }
  }
})
</script>

<style lang="scss" scoped>
  .backBtn {
      float: right;
  }
</style>
