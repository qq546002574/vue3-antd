<template>
    <a-card :title="title">
      <a-button :loading="loading" type="primary" class="backBtn">
        <router-link to="/tactics/quartz" >返回</router-link>
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
import {defineComponent, onMounted,reactive, toRefs, ref} from 'vue'
import {Card, Tabs} from 'ant-design-vue'
import {BaseInfo} from './components/info-tabs'

export default defineComponent({
  name: "quartz-info",
  props: ['jobId'],
  components: {ACard: Card, ATabs: Tabs, ATabPane: Tabs.TabPane, BaseInfo},
  setup(props, {attrs}) {
    console.log('props', props);
    console.log('attrs', attrs);  
    const title = ref('新增定时任务');
    onMounted(async () => {
      if (props.jobId == 'add') {
        title.value = '新增定时任务'
      } else {
        title.value = '修改定时任务'
      }
    })

    return { title }
  }
})
</script>

<style lang="scss" scoped>
  .backBtn {
      float: right;
  }
</style>
