<template>
  <config-provider v-show="lockTime > 0 || unLockLogin" :locale="zhCN">
    <router-view v-slot="{ Component }">
      <component :is="Component"/>
    </router-view>
  </config-provider>
  <transition name="slide-up">
    <lock-screen v-model:un-lock-login="unLockLogin" v-model:lock-time="lockTime" v-if="lockTime <= 0 || unLockLogin"/>
  </transition>
</template>

<script lang="ts">
import {defineComponent, ref} from 'vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import {ConfigProvider} from 'ant-design-vue'
import {LockScreen} from '@/components/lockscreen'
import {useUserLeave} from '@/hooks/useUserStatus'

export default defineComponent({
  name: 'App',
  components: {ConfigProvider, LockScreen},
  setup() {

    const unLockLogin = ref(false)
    const {lockTime} = useUserLeave()

    return {
      zhCN,
      lockTime,
      unLockLogin
    }
  }
});
</script>

<style lang="scss">
@import "~@/styles/global.scss";
@import "~@/styles/common.scss";
@import "~@/styles/override.scss";
</style>
