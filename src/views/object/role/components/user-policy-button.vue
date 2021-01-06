<template>
  <tool-outlined @click.stop="visible = true"/>
  <a-modal
      v-model:visible="visible"
      centered
      :width="400"
      :confirm-loading="settingLoading"
      title="设置默认用户策略"
      @ok="settingPolicy"
  >
    <template v-slot:footer>
      <a-button key="back" @click="visible = false">
        取消
      </a-button>
      <a-button key="submit" type="primary" :loading="settingLoading" @click="settingPolicy">
        保存
      </a-button>
      <a-button type="primary" :loading="applyLoading" @click="applyPolicy">
        应用策略
      </a-button>
    </template>
    <a-spin :spinning="spinning">
      <div style="min-height: 150px">
        <a-checkbox-group v-model:value="checkeds">
          <a-row>
            <a-col v-for="item in policyList" :span="8" :key="item.id">
              <a-checkbox :value="item.policy">
                {{ item.caption }}
              </a-checkbox>
            </a-col>
          </a-row>
        </a-checkbox-group>
      </div>
    </a-spin>
  </a-modal>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, watch} from 'vue'
import {userPolicylist, userSetdefaultpolicy, userGetdefaultpolicy, userUsedefaultpolicy} from '@/api/user'
import {ToolOutlined} from '@ant-design/icons-vue'
import {Modal, Row, Col, Spin, message} from 'ant-design-vue'

export default defineComponent({
  name: "user-policy-button",
  components: {ToolOutlined, [Modal.name]: Modal, [Row.name]: Row, [Col.name]: Col, [Spin.name]: Spin},
  setup() {
    const state = reactive({
      visible: false,
      settingLoading: false, // 设置加载
      applyLoading: false, // 应用加载
      spinning: true,
      checkeds: [],
      policyList: []
    })

    watch(() => state.visible, async value => {
      if (value) {
        const list = await userPolicylist({})
        state.policyList = list
        state.spinning = false
        const checkArr = await userGetdefaultpolicy({})
        state.checkeds = checkArr
      }
    })

    // 设置默认用户策略
    const settingPolicy = async () => {
      state.settingLoading = true
      let sum = 0
      state.checkeds.forEach(policy => sum += ~~policy)
      await userSetdefaultpolicy({policy: sum}).finally(() => state.settingLoading = false)
      state.visible = false
    }

    // 应用默认用户策略
    const applyPolicy = async () => {
      state.applyLoading = true
      let sum = 0
      state.checkeds.forEach(policy => sum += ~~policy)
      await userUsedefaultpolicy({policy: sum}).finally(() => state.applyLoading = false)
      state.visible = false
    }

    return {
      ...toRefs(state),
      applyPolicy,
      settingPolicy
    }
  }
})
</script>

<style scoped>
</style>
