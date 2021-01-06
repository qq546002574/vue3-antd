<template>
  <div class="base-info">
    <a-form layout="horizontal" :label-col="formCol.labelCol"
            :wrapper-col="formCol.wrapperCol">
      <!--      <a-descriptions-item v-for="(value, key) in formatKeys" :key="key" :label="value">-->
      <!--        {{ infoObj[key] }}-->
      <!--      </a-descriptions-item>-->
      <a-form-item label="终端别名">
          <a-input v-model:value="infoObj.cname"/>
          <a-button @click="saveChange" :loading="loading" type="primary">保存修改</a-button>
      </a-form-item>
      <a-form-item label="终端序列号">
        {{ infoObj.pid }}
      </a-form-item>
      <a-form-item label="IP地址">
        {{ infoObj.ip }}
      </a-form-item>
      <a-form-item label="MAC地址">
        {{ infoObj.pid?.slice(-12) }}
      </a-form-item>
      <a-form-item label="版本号">
        {{ infoObj.versions }}
      </a-form-item>
      <a-form-item label="离线时间">
        {{ formatDate(infoObj.offlinefromtime) }}
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted,reactive, toRefs} from 'vue'
import { message} from 'ant-design-vue'
import {clientBase, clientRename} from "@/api/client";
import dayjs from "dayjs";

export default defineComponent({
  name: "base-info",
  setup(props, {attrs}) {

    const formatKeys = {
      cname: '终端别名',
      pid: '终端序列码',
      ip: 'IP地址',
      mac: 'MAC地址',
      versions: '版本号',
      offlinefromtime: '离线时间'
    }
    const formCol = {
      labelCol: {span: 4},
      wrapperCol: {span: 14},
    }

    // 格式化时间
    const formatDate = (time) => {
      return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    }

    const state = reactive({
      loading: false,
      infoObj: {
        cname: ''
      }
    })

    onMounted(async () => {
      state.infoObj = await clientBase({}, attrs.pid)
    })

    const saveChange = async () => {
      state.loading = true
      const res = await clientRename({name: state.infoObj.cname}, attrs.pid).finally(() => state.loading = false)
      if (res.code == 1) {
        message.success('修改成功')
      } else {
        message[res.type](res.message || '修改失败')
      }
    }

    return {
      ...toRefs(state),
      formCol,
      formatKeys,
      formatDate,
      saveChange
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
