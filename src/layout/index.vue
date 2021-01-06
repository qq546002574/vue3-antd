<template>
  <a-layout class="layout">
    <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible class="layout-sider">
      <sider-menu :collapsed="collapsed"/>
    </a-layout-sider>
    <a-layout>
      <page-header v-model:collapsed="collapsed" />
      <a-layout-content class="layout-content">
        <tabs-view/>
      </a-layout-content>
      <!--      <PageFooter></PageFooter>-->
    </a-layout>
  </a-layout>
</template>

<script lang="ts">
import {defineComponent, ref, h, computed, reactive} from 'vue'
import {Layout, message} from 'ant-design-vue'

import {TabsView} from './tabs'
import SiderMenu from './menu/index.vue'
import PageHeader from './header/index.vue'
import { useRouter} from "vue-router";
import { validByToken } from "@/api/sys/user";

export default defineComponent({
  name: 'Layout',
  components: {
    TabsView,
    PageHeader,
    SiderMenu,
    [Layout.name]: Layout,
    [Layout.Content.name]: Layout.Content,
    [Layout.Sider.name]: Layout.Sider,
  },
  setup() {
    const collapsed = ref<boolean>(false)
    console.log('.......');
    const router = useRouter()
    const loginInfo = localStorage.getItem('loginInfo');
    const validToken = async (token) => {
      if (token) { // 校验服务器
        const res = await validByToken({token});
        if (res.code != 1 || !res.result) {
          router.replace('/login')
          localStorage.setItem('errorInfo', '1');
        } else {
          localStorage.setItem('errorInfo', '0');
        }
      } else { 
        router.replace('/login')
      }
    }
    const validFlag = localStorage.getItem('errorInfo');
    if(validFlag === '0') {
      validToken(loginInfo);
    } else { 
      router.replace('/login')
    }
    
    const testMsg = () => {
      message.success(h('span', '啥子'), 2)
    }

    const asiderWidth = computed(() => collapsed.value ? '80px' : '256px')

    

    return {
      collapsed,
      testMsg,
      asiderWidth
    }
  }
})

</script>

<style lang="scss" scoped>
.layout {
  display: flex;
  overflow: hidden;
  height: 100vh;

  .layout-sider {

  }

  .ant-layout {
    overflow: hidden;
  }

  .layout-content {
    flex: none;
  }
}
</style>
