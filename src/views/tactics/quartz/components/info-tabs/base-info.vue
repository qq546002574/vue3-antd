<template>
  <div class="base-info">
    <a-form layout="horizontal" :label-col="formCol.labelCol"
            :wrapper-col="formCol.wrapperCol">
      <a-form-item :label="formatKeys.jobId" :label-col="formItemCol.labelCol" :wrapper-col="formItemCol.wrapperCol" v-if="btnName === '保存修改'">
        <a-input v-model:value="infoObj.jobId" disabled/>
      </a-form-item>
      <a-form-item :label="formatKeys.jobClass">
        <a-input v-model:value="infoObj.jobClass"/>
      </a-form-item>
      <a-form-item :label="formatKeys.jobGroup">
        <a-input v-model:value="infoObj.jobGroup"/>
      </a-form-item>
      <a-form-item :label="formatKeys.jobName">
        <a-input v-model:value="infoObj.jobName"/>
      </a-form-item>
      <a-form-item :label="formatKeys.triggerName">
        <a-input v-model:value="infoObj.triggerName"/>
      </a-form-item>
      <a-form-item :label="formatKeys.triggerGroupName">
        <a-input v-model:value="infoObj.triggerGroupName"/>
      </a-form-item>
      <a-form-item :label="formatKeys.cronExpr">
        <a-input v-model:value="infoObj.cronExpr"/>
      </a-form-item>
      <!-- <a-form-item :label="formatKeys.jobStatus">
        <a-input v-model:value="infoObj.jobStatus"/>
      </a-form-item> -->
      <!-- <a-form-item :label="formatKeys.startTime">
        <a-input v-model:value="infoObj.startTime"/>
      </a-form-item> -->
      <a-form-item :label="formatKeys.description">
        <a-input v-model:value="infoObj.description"/>
      </a-form-item>
      <a-button v-if="btnName === '保存修改'" @click="saveChange" :loading="loading" type="primary">{{btnName}}</a-button>
      <a-button v-else @click="saveAdd" :loading="loading" type="primary">{{btnName}}</a-button>
    </a-form>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted,reactive, toRefs, ref} from 'vue'
import { message} from 'ant-design-vue'
import {quartzDetail, updateBase, addQuartz} from "@/api/quartz";
import dayjs from "dayjs";

export default defineComponent({
  name: "base-info",
  setup(props, {attrs}) {
    console.log('info-props', props);
    console.log('info-attrs', attrs);
    const formatKeys = {
      jobId: '序号',
      jobClass: '任务类',
      jobGroup: '任务组',
      jobName: '任务名称',
      triggerName: '触发器',
      triggerGroupName: '触发器组名',
      cronExpr: 'cron表达式',
      // jobStatus: '任务状态',
      // startTime: '开始时间',
      description: '任务描述',
    }
    const formCol = {
      labelCol: {span: 4},
      wrapperCol: {span: 14},
    }

    const formItemCol = {
      labelCol: {span: 4},
      wrapperCol: {span: 4},
    }

    const state = reactive({
      loading: false,
      infoObj: {
        jobId: '',
        jobClass: '',
        jobGroup: '',
        jobName: '',
        triggerName: '',
        triggerGroupName: '',
        cronExpr: '',
        // jobStatus: '',
        // startTime: '',
        description: '',
      }
    })

    const btnName = ref('保存修改');

    onMounted(async () => {
      if (attrs.jobId != 'add') {
        state.infoObj = await quartzDetail({}, attrs.jobId)
        btnName.value = '保存修改'
      } else {
        btnName.value = '保存'
      }
    })

    const saveChange = async () => {
      state.loading = true
      const res = await updateBase(state.infoObj).finally(() => state.loading = false)
      if (res.code == 1) {
          message.success('修改成功')
        } else {
          message[res.type](res.message || '修改失败')
        }
    }

    const saveAdd = async () => {
      state.loading = true
      const res = await addQuartz(state.infoObj).finally(() => state.loading = false)
      if (res.code == 1) {
          message.success('新增成功')
        } else {
          message[res.type](res.message || '新增失败')
        }
    }

    return {
      ...toRefs(state),
      formCol,
      formItemCol,
      formatKeys,
      saveChange,
      saveAdd,
      btnName
    }
  }
})
</script>

<style lang="scss" scoped>
::v-deep(.ant-form-item-children) {
  display: inline-flex;
  button {
    margin-left: 10px;
  }
}
</style>
