<template>
  <div ref="rootEl">
    <a-modal
        v-model:visible="modalVisible"
        title="修改密码"
        centered
        destroyOnClose
        :footer="null"
    >
      <a-form ref="ruleForm" layout="horizontal" :model="formInline" :rules="rules" v-bind="formItemLayout"
              @finish="handleFinish"
              @finishFailed="handleFinishFailed" @submit.prevent>
        <a-form-item label="账号">
          <a-input v-model:value="formInline.username" disabled placeholder="请输入账号">
          </a-input>
        </a-form-item>
        <a-form-item required has-feedback name="password" label="新密码">
          <a-input v-model:value="formInline.password" type="password" autocomplete="new-password"/>
        </a-form-item>
        <a-form-item has-feedback name="checkPassword" label="确认密码">
          <a-input v-model:value="formInline.checkPassword" type="password" autocomplete="new-password"/>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 19, offset: 5 }">
          <a-space :size="24">
            <a-button
                type="primary"
                html-type="submit"
                :loading="loading"
                :disabled="formInline.username === '' || formInline.password === ''"
            >
              确定
            </a-button>
            <a-button @click="modalVisible = false">取消</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts">

import {defineComponent, ref, toRefs, reactive} from 'vue'
import {ModalProps} from './props'
import {useEventbus} from "@/hooks/useEventbus";
import {changePassword} from '@/api/sys/user'
import {message} from "ant-design-vue";
import md5 from 'blueimp-md5'

import components from './components'

export default defineComponent({
  name: "user-edit",
  components: {...components},
  props: ['userInfo'],
  setup(props: ModalProps) {
    const {toRefreshTable} = useEventbus()
    const ruleForm = ref(null) as any
    const state = reactive({
      modalVisible: true,
      loading: false, // 按钮加载状态
      deptTree: [],
      selectedNode: null as any,
      formInline: {
        userId: '',
        username: '',
        password: '',
        checkPassword: '' as any,
        ...props.userInfo
      },
      formItemLayout: {
        labelCol: {span: 5},
        wrapperCol: {span: 19},
      }
    })

    const validatePass = async (rule, value) => {
      if (value === '') {
        return Promise.reject('请输入密码');
      } else {
        if (state.formInline.checkPassword !== '') {
          ruleForm.value.validateField('checkPassword');
        }
        return Promise.resolve();
      }
    }
    const validatePass2 = async (rule, value, callback) => {
      if (value === '') {
        return Promise.reject('请输入确认密码');
      } else if (value !== state.formInline.password) {
        return Promise.reject("两次输入的密码不匹配!");
      } else {
        return Promise.resolve();
      }
    }
    // 验证规则
    const rules = ref({
      password: [{validator: validatePass, trigger: 'change'}],
      checkPassword: [{validator: validatePass2, trigger: 'change'}]
    })

    // 完成输入
    const handleFinish = async (values) => {
      console.log(values);
      console.log(state.formInline.userId)
      state.loading = true
      const params = {
        password: md5(state.formInline.password)
      }
      const res = await changePassword(params, state.formInline.userId).finally(() => state.loading = false)
      if (res.code == 1) {
        message.success('修改成功')
      } else {
        message[res.type](res.message || '添加失败')
      }
      state.modalVisible = false
      // 通知刷新表格
      toRefreshTable()
    }
    const handleFinishFailed = (errors) => {
      console.log(errors);
    }

    return {
      ...toRefs(state),
      ruleForm,
      rules,
      handleFinish,
      handleFinishFailed
    }
  }
})
</script>

<style scoped>

</style>
