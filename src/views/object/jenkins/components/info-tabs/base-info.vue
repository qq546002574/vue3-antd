<template>
  <div class="base-info">
    <a-form layout="horizontal" :label-col="formCol.labelCol"
            :wrapper-col="formCol.wrapperCol">
      <a-form-item label="序号" :label-col="formItemCol.labelCol" :wrapper-col="formItemCol.wrapperCol" v-if="btnName === '保存修改'">
        <a-input v-model:value="infoObj.id" disabled/>
      </a-form-item>
      <a-form-item label="任务名称">
        <a-input v-model:value="infoObj.jobCurrentName"/>
      </a-form-item>
      <a-form-item label="tomcat名称">
        <a-input v-model:value="infoObj.tomcatInstanceName"/>
      </a-form-item>
      <a-form-item label="jenkins环境项目名">
        <a-input v-model:value="infoObj.jobPlace"/>
      </a-form-item>
      <a-form-item label="Maven打包后的jar名称">
        <a-input v-model:value="infoObj.warName"/>
      </a-form-item>
      <a-form-item label="部署环境">
        <a-input v-model:value="infoObj.deployType"/>
      </a-form-item>
      <a-form-item label="打包方式">
        <a-input v-model:value="infoObj.packageWay"/>
      </a-form-item>
      <a-form-item label="分支名称">
        <a-input v-model:value="infoObj.deployBranch"/>
      </a-form-item>
      <a-button v-if="btnName === '保存修改'" @click="saveChange" :loading="loading" type="primary">{{btnName}}</a-button>
      <a-button v-else @click="saveAdd" :loading="loading" type="primary">{{btnName}}</a-button>
    </a-form>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted,reactive, toRefs, ref} from 'vue'
import { message} from 'ant-design-vue'
import {clientBase, updateBase, addJenkins} from "@/api/jenkins";
import dayjs from "dayjs";

export default defineComponent({
  name: "base-info",
  setup(props, {attrs}) {
    console.log('props', props);
    console.log('attrs', attrs);
    const formatKeys = {
      id: '序号',
      jobCurrentName: '任务名称',
      tomcatInstanceName: 'tomcat名称',
      jobPlace: 'jenkins环境项目名',
      warName: 'Maven打包后的jar名称',
      deployType: '部署环境',
      packageWay: '打包方式',
      deployBranch: '分支名称',
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
        id: '',
        jobCurrentName: '',
        tomcatInstanceName: '',
        jobPlace: '',
        warName: '',
        deployType: '',
        packageWay: '',
        deployBranch: ''
      }
    })

    const btnName = ref('保存修改');

    onMounted(async () => {
      if (attrs.id != 'add') {
        state.infoObj = await clientBase({}, attrs.id)
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
      const res = await addJenkins(state.infoObj).finally(() => state.loading = false)
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
