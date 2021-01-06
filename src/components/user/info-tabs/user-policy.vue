<template>
  <div class="client-info">
    <a-form layout="vertical" :model="form">
      <a-form-item label="移动储存控制设置">
        <a-radio-group v-model:value="form.type" class="radio-group">
          <a-radio :value="0">
            普通模式
          </a-radio>
          <a-radio :value="1">
            禁用模式
          </a-radio>
          <a-radio :value="2">
            审批模式
          </a-radio>
        </a-radio-group>
        <div class="btn-row">
          <a-button @click="saveDiskControl($attrs.uid)">保存</a-button>
          <a-button @click="saveDiskControl(0)">应用到全部用户</a-button>
        </div>
      </a-form-item>
      <a-form-item label="解密设置">
        <a-tabs v-model:activeKey="activeKey" :animated="false">
          <a-tab-pane :key="1" tab="在线解密">
            <table-data @reload="initData" :params="{user: $attrs.uid,type: 1}" @load="tableLoaded(1, $event)" />
          </a-tab-pane>
          <a-tab-pane :key="2" tab="离线解密">
            <table-data @reload="initData" :params="{user: $attrs.uid,type: 2}" @load="tableLoaded(2, $event)" />
          </a-tab-pane>
        </a-tabs>
        <user-policy-modal @changedept-success="initData" :check-list="checkList" :all-type="allType" :type="activeKey" v-bind="$attrs" />
      </a-form-item>
      <a-form-item>
        <a-checkbox v-model:checked="allType">
          全部解密
        </a-checkbox>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, toRefs} from 'vue'
import {message, Tabs} from 'ant-design-vue'
import {userPolicyList, userDisk, userUidPolicy, userGetPolicy} from "@/api/user";
import {TableData, UserPolicyModal} from './components/'

export default defineComponent({
  name: "user-policy",
  components: {ATabs: Tabs, ATabPane: Tabs.TabPane, TableData, UserPolicyModal},
  setup(props, {attrs}) {

    const state = reactive({
      form: {
        type: 0
      },
      allType: false,
      activeKey: 1,
      userPolicy: {},
      checkList: {
        1: [],
        2: []
      }
    })

    // 保存移动储存控制设置
    const saveDiskControl = async (uid) => {
      await userDisk({user: uid, type: state.form.type})
    }

    // 获取用户策略
    const getUserPolicy = async () => {
      const result = await userUidPolicy({}, attrs.uid)
      state.form.type = result.udiskcontrol
      state.userPolicy = result
    }

    const initData = async () => {
      getUserPolicy()
      userGetPolicy({user: attrs.uid})
      await userPolicyList({})
    }

    const tableLoaded = (type, data) => {
      state.checkList[type] = data.map(item => item.id)
    }

    onMounted(() => {
      initData
    })

    return {
      ...toRefs(state),
      initData,
      tableLoaded,
      saveDiskControl
    }
  }
})
</script>

<style lang="scss" scoped>
.radio-group {
  display: block;
  margin: 10px 0 18px 0;
}
.btn-row {
  display: flex;
  button {
    margin-right: 10px;
  }
}
</style>
