<template>
    <a-form layout="horizontal" :label-col="formCol.labelCol"
            :wrapper-col="formCol.wrapperCol" :model="form">
      <a-form-item label="部门名称">
        {{infoObj.dname}}
      </a-form-item>
      <a-form-item label="地址">
        <a-input v-model:value="form.office" placeholder="请输入地址"/>
      </a-form-item>
      <a-form-item label="电话">
        <a-input v-model:value="form.tel" placeholder="请输入电话"/>
      </a-form-item>
      <a-form-item label="传真">
        <a-input v-model:value="form.fax" placeholder="请输入传真"/>
      </a-form-item>
      <a-form-item label="父部门">
        {{infoObj.father}}
      </a-form-item>
      <a-form-item label="介绍">
        <a-textarea v-model:value="form.description" placeholder="部门介绍"/>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button @click="saveChange" type="primary">
          保存修改
        </a-button>
      </a-form-item>
    </a-form>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, toRefs} from 'vue'
import {Descriptions, message} from 'ant-design-vue'
import {deptInfo, deptUpdate} from "@/api/dept";

export default defineComponent({
  name: "base-info",
  components: {ADescriptions: Descriptions, ADescriptionsItem: Descriptions.Item},
  setup(props, {attrs}) {

    const formCol = {
      labelCol: {span: 4},
      wrapperCol: {span: 14},
    }

    const state = reactive({
      form: {
        "id": '',
        "office": '',
        "tel": '',
        "fax": '',
        "description": ''
      },
      infoObj: {}
    })

    const formatKeys = {
      cname: '终端别名',
      pid: '终端序列码',
      ip: 'IP地址',
      mac: 'MAC地址',
      versions: '版本号',
      offlinefromtime: '离线时间'
    }

    // cname: "QZ-PC"
    // departmentid: 1
    // ip: "192.168.102.196"
    // isapproved: 1
    // lastloginuser: "h1"
    // loginuserid: 1
    // offlinefromtime: 1590051918000
    // pid: "051914399C5C8E881B16"
    // versions: "6.0.4.128"
    onMounted(async () => {
      state.infoObj = await deptInfo({}, attrs.deptId)
      Object.keys(state.form).forEach(key => state.form[key] = state.infoObj[key])
    })

    const saveChange = async () => {
       await deptUpdate(state.form)
    }

    return {
      ...toRefs(state),
      formCol,
      formatKeys,
      saveChange
    }
  }
})
</script>
