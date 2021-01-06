<template>
  <a-card title="系统配置">
    <template v-if="domWidth <= 1314" v-slot:extra>
      <a-button
          type="primary"
          :loading="loading"
          @click="saveChange"
      >
        保存修改
      </a-button>
    </template>
    <a-row :gutter="[16,16]">
      <a-col v-for="(value, key) in configOptions" :span="8" :key="key">
        <template v-if="key == 7">
          <a-checkbox :disabled="formInline['8']" v-model:checked="formInline[key]">{{ value }}</a-checkbox>
        </template>
        <template v-else>
          <a-checkbox v-model:checked="formInline[key]">{{ value }}</a-checkbox>
        </template>
      </a-col>
      <a-col :span="24">
        消息扫描间隔(秒)：
        <a-input-number
            v-model:value="formInline.LimitTime"
            :formatter="value => `${value}s`"
            :parser="value => value.replace('s', '')"
            :min="0" style="marginLeft: 16px"/>
        <a-button type="primary" ghost style="margin-left: 14px">修改进程列表</a-button>
      </a-col>
      <a-col :span="24">
        托盘延迟启动时间(秒)：
        <a-input-number
            v-model:value="formInline.TrayLoadTime"
            :formatter="value => `${value}s`"
            :parser="value => value.replace('s', '')"
            :min="0" style="marginLeft: 16px"/>
      </a-col>
      <a-col :span="24">
        xls、xlsx文件打开保留备份数量：
        <a-input-number
            v-model:value="formInline.Xlsbackdays"
            :formatter="value => `${value}`"
            :parser="value => value.replace('', '')"
            :min="0" style="marginLeft: 16px"/>
      </a-col>
      <a-col v-if="domWidth > 1314" :span="24">
        <a-button
            type="primary"
            :loading="loading"
            @click="saveChange"
        >
          保存修改
        </a-button>
      </a-col>
    </a-row>
  </a-card>
</template>'

<script lang="ts">
import {defineComponent, reactive, toRefs, onMounted} from 'vue'
import {Card, Col, Row, InputNumber, message} from 'ant-design-vue'
import {useDomWidth} from '@/hooks/useDomWidth'

import {sysConfig, sysSetconfig} from '@/api/sys/config'

// AppAutoStart: 1
// ApproveOption: 0
// ApproverConfig: 0
// DecryAll: 0
// DecryMe: 1
// EncryBackup: 0
// FileBackup: 0
// LimitTime: 3
// NeedReson: 1
// OfflineDecryAll: 1
// ServerJG: 0
// SystemConfig: 0
// TrayLoadTime: 5
// TrustAll: 0
// Xlsbackdays: 2
const configOptions = {
  EncryBackup: '手动加密备份文件',
  FileBackup: '解密申请备份文件',
  AppAutoStart: '应用保护开机启动',
  AskWhenDel: '控制中心删除项目进行提示',
  NeedReson: '手动解密审批需要填写理由',
  TrustAll: '允许所有部门文件相互打开',
  DecryMe: '允许用户申请解密自己的文件',
  DecryAll: '允许用户申请解密所有文件',
  OfflineDecryAll: '允许用户离线解密所有的文件',
  SystemConfig: '允许域用户客户端自动登录',
  ApproveOption: '可指定下级审批人',
  ServerJG: '终端加固',
  ApproverConfig: '解密申请时显示部门所有审批人',
}

export default defineComponent({
  name: "config",
  components: {[Card.name]: Card, [Col.name]: Col, [Row.name]: Row, [InputNumber.name]: InputNumber},
  setup() {
    const domWidth = useDomWidth()
// 不用进行true false转换的key
    const exclusive = ['Xlsbackdays', 'TrayLoadTime', 'LimitTime']

    const state = reactive({
      formInline: {
        AppAutoStart: false,
        ApproveOption: false,
        ApproverConfig: false,
        DecryAll: false,
        DecryMe: false,
        EncryBackup: false,
        FileBackup: false,
        NeedReson: false,
        applyAll: false,
        OfflineDecryAll: false,
        ServerJG: false,
        AskWhenDel: false,
        SystemConfig: false,
        TrustAll: false,
        TrayLoadTime: 0,
        LimitTime: 0,
        Xlsbackdays: 0
      },
      loading: false
    })

    onMounted(async () => {
      // 获取配置信息
      const data = await sysConfig({})
      for (const key in data) {
        state.formInline[key] = exclusive.includes(key) ? data[key] : data[key] == 1
      }
    })

    // 保存修改
    const saveChange = async () => {
      const params = {}

      for (const key in state.formInline) {
        if (exclusive.includes(key)) {
          params[key] = state.formInline[key] + ''
        } else {
          params[key] = state.formInline[key] ? 1 + '' : 0 + ''
        }
      }
      await sysSetconfig({config: JSON.stringify(params)})
    }

    return {
      ...toRefs(state),
      domWidth,
      saveChange,
      configOptions
    }
  }
})
</script>

<style scoped>
</style>
