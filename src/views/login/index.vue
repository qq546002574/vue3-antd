<template>
  <div class="login-box">
    <div class="login-logo">
      <svg-icon icon-class="logo" />
      <h1>Person</h1>
    </div>
    <a-form layout="horizontal" :model="formInline" @submit="handleSubmit" @submit.prevent>
      <a-form-item>
        <a-input v-model:value="formInline.username" size="large" placeholder="请输入用户名">
          <template v-slot:prefix><user-outlined type="user"/></template>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input v-model:value="formInline.password" size="large" type="password" placeholder="请输入密码" autocomplete="new-password">
          <template v-slot:prefix><lock-outlined type="user"/></template>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-button
            type="primary"
            html-type="submit"
            size="large"
            :loading="loading"
            block
        >
          登录
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, onMounted} from 'vue'
import {message} from 'ant-design-vue'
import {UserOutlined, LockOutlined} from '@ant-design/icons-vue'
import md5 from 'blueimp-md5'
// ~@/assets/logo.png
import {useRoute, useRouter} from "vue-router";

import { login } from "@/api/sys/user";

import { SvgIcon } from '@/components/svg-icon'

export default defineComponent({
  name: "login",
  components: {UserOutlined, LockOutlined, SvgIcon},
  setup() {
    const state = reactive({
      loading: false,
      formInline: {
        username: '',
        password: '',
      }
    })

    const router = useRouter()
    const route = useRoute()
    const validFlag = localStorage.getItem('errorInfo');
    const loginInfo = localStorage.getItem('loginInfo');
    if (loginInfo && validFlag === '0') {
      router.replace('/')
    }

    const handleSubmit = async () => {
      const {username, password} = state.formInline
      if(username.trim() == '' || password.trim() == '') return message.warning('用户名或密码不能为空！')
      const hide = message.loading('登录中...', 0)
      state.loading = true
      console.log(state.formInline)
      const params = {
        username,
        password
      }
      params.password = md5(password)
      const result = await login(params).finally(() => {
        state.loading = false
        message.destroy()
      })
      if (result.code == 1) {
        const toPath = decodeURIComponent((route.query?.redirect || '/') as string)
        message.success('登录成功！')
        router.replace(toPath).then(_ => {
          if (route.name == 'login') {
            router.replace('/')
          }
        })
        localStorage.setItem('username', params.username)
        localStorage.setItem('loginInfo', result.result)
        localStorage.setItem('errorInfo', '0')
      } else {
        message[result.type](result.message || '登录失败')
      }
    }
    return {
      ...toRefs(state),
      handleSubmit
    }
  }
})
</script>

<style lang="scss" scoped>
.login-box {
  width: 100vw;
  height: 100vh;
  display: flex;
  padding-top: 240px;
  flex-direction: column;
  align-items: center;
  background: url("~@/assets/login.svg");
  background-size: 100%;

  .login-logo {
    display: flex;
    align-items: center;
    margin-bottom: 30px;

    .svg-icon {
      font-size: 48px;
    }

    img {
      height: 48px;
    }
    h1 {
      margin-left: 10px;
      margin-bottom: 0;
    }
  }

    .ant-form {
      width: 400px;

      .ant-form-item-label {
        padding-right: 6px;
      }
  }
}
</style>
