<template>
  <ALayoutHeader class="layout-header">
    <div class="left-options">
      <span @click="() => $emit('update:collapsed', !collapsed)" class="menu-fold">
        <component :is="collapsed ? 'menu-unfold-outlined' : 'menu-fold-outlined'" />
    </span>
      <a-breadcrumb>
        <a-breadcrumb-item v-for="routeItem in route.matched" :key="routeItem.name">
          <a>{{ routeItem.meta.title }}</a>
          <template v-slot:overlay>
            <a-menu v-if="routeItem.children.length">
              <template v-for="childItem in routeItem.children">
                <a-menu-item v-if="!childItem.meta.hidden" :key="childItem.path">
                  <router-link :to="routeItem.path == '/' ? childItem.path : (routeItem.path + '/' + childItem.path)">
                    {{ childItem.meta.title }}
                  </router-link>
                </a-menu-item>
              </template>
            </a-menu>
          </template>
        </a-breadcrumb-item>
      </a-breadcrumb>
    </div>
    <div class="right-options">
<!--      网站设置-->
<!--      <SettingOutlined/>-->
<!--      搜索-->
<!--      <SearchOutlined/>-->
<!--      切换全屏-->
      <component :is="fullscreenIcon" @click="toggleFullScreen" />
      <Dropdown>
        <a-avatar>{{ username }}</a-avatar>
        <template v-slot:overlay>
          <a-menu>
<!--            <a-menu-item>-->
<!--              <a href="javascript:;">个人中心</a>-->
<!--            </a-menu-item>-->
<!--            <a-menu-divider/>-->
            <a-menu-item>
              <a @click.prevent="doLogout"><poweroff-outlined /> 退出登录</a>
            </a-menu-item>
          </a-menu>
        </template>
      </Dropdown>
    </div>
  </ALayoutHeader>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import components from "@/layout/header/components";
import {logout} from "@/api/sys/user";

export default defineComponent({
  name: "PageHeader",
  components: {...components},
  props: {
    collapsed: {
      type: Boolean,
    }
  },
  setup() {
    const state = reactive({
      username: localStorage.getItem('username') || '',
      fullscreenIcon: 'FullscreenOutlined'
    })
    const router = useRouter()
    const route = useRoute()
    console.log(route.matched)
    console.log(router.getRoutes(), 'currentRoute')
    const token = localStorage.getItem('loginInfo')
    const doLogout = async () => {
      console.log(router, '退出登录')
      const result = await logout({token})
      if (result.code == 1) {
        localStorage.removeItem('loginInfo')
        localStorage.removeItem('username')
        localStorage.removeItem('isLock')
      }
      console.log('result', result);
      router.replace({
        name: 'login',
        query: {
          redirect: route.fullPath
        }
      })
    }

    // 切换全屏图标
    const toggleFullscreenIcon = () => (state.fullscreenIcon = document.fullscreenElement !== null ? 'FullscreenExitOutlined' : 'FullscreenOutlined')

    // 监听全屏切换事件
    document.addEventListener("fullscreenchange", toggleFullscreenIcon)

    // 全屏切换
    const toggleFullScreen = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    }

    return {
      ...toRefs(state),
      toggleFullScreen,
      doLogout,
      route
    }
  }
})
</script>

<style lang="scss" scoped>
.layout-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #fff;
  padding: 0;
  height: $header-height;

  .left-options {
    display: flex;
    align-items: center;

    .menu-fold {
      padding: 0 24px;
      cursor: pointer;
    }
  }

  .right-options {
    display: flex;
    align-items: center;

    > * {
      margin-right: 20px;
      cursor: pointer;
    }
  }
}
</style>
