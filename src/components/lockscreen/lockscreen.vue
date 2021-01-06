<template>
  <div @keyup="$emit('update:un-lock-login',true)" @mousedown.stop @contextmenu.prevent :class="{unLockLogin}"
       class="lockscreen">
    <template v-if="!unLockLogin">
      <div class="lock-box">
        <div class="lock">
          <span @click="$emit('update:un-lock-login',true)" class="lock-icon" title="解锁屏幕">
            <lock-outlined/>
            <unlock-outlined/>
          </span>
        </div>
        <h6 class="tips">由于您长时间未操作，需重新输入登录密码解锁进入系统。</h6>
      </div>
<!--      华为充电-->
      <component :is="Math.random() > 0.48 ? 'xiaomi-charge' : 'huawei-charge'" :battery="battery" :battery-status="batteryStatus" :calc-discharging-time="calcDischargingTime" />
<!--      <xiaomi-charge :battery="battery" />-->
    </template>
    <template v-if="unLockLogin">
      <div class="login-box">
        <a-avatar :size="128">
          <template v-slot:icon>
            <user-outlined/>
          </template>
        </a-avatar>
        <div class="username">{{ loginForm.username }}</div>
        <a-input-search
            v-model:value="loginForm.password"
            type="password"
            placeholder="请输入登录密码"
            size="large"
            @search="onLogin"
        >
          <template v-slot:enterButton>
            <arrow-right-outlined/>
          </template>
        </a-input-search>
        <a style="margin-top: 10px" @click="nav2login">重新登录</a>
      </div>
    </template>
    <template v-if="!unLockLogin">
      <div class="local-time">
        <div class="time">
          {{ hour }}:{{ minute }}
        </div>
        <div class="date">
          {{ month }}月{{ day }}号，星期{{ week }}
        </div>
      </div>
      <div class="computer-status">
      <span :class="{offline: !online}" class="network">
        <wifi-outlined class="network"/>
      </span>
        <api-outlined/>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, toRefs, computed, ref} from 'vue'
import {Avatar, message} from 'ant-design-vue'
import {
  LockOutlined,
  UnlockOutlined,
  UserOutlined,
  ApiOutlined,
  ArrowRightOutlined,
  WifiOutlined
} from '@ant-design/icons-vue'

import {useRouter, useRoute} from "vue-router";
import {useUserOnline} from '@/hooks/useUserStatus'
import {useTime} from '@/hooks/useTime'
import {setIsLock} from '@/hooks/useUserStatus'
import {login} from "@/api/sys/user";
import md5 from 'blueimp-md5'
import HuaweiCharge from './huawei-charge.vue'
import XiaomiCharge from './xiaomi-charge.vue'

interface Battery {
  charging: boolean; // 当前电池是否正在充电
  chargingTime: number; // 距离充电完毕还需多少秒，如果为0则充电完毕
  dischargingTime: number; // 代表距离电池耗电至空且挂起需要多少秒
  level: number; // 代表电量的放大等级，这个值在 0.0 至 1.0 之间
  [key: string]: any;
}

export default defineComponent({
  name: "lockscreen",
  props: {
    unLockLogin: {// 是否解锁
      type: Boolean,
      default: false
    },
    lockTime: {
      type: Number,
      default: 0
    }
  },
  components: {
    LockOutlined,
    UnlockOutlined,
    UserOutlined,
    ArrowRightOutlined,
    ApiOutlined,
    WifiOutlined,
    [Avatar.name]: Avatar,
    HuaweiCharge,XiaomiCharge
  },
  setup(props, {emit}) {
    // 获取本地时间
    const {month, day, hour, minute, second, week} = useTime()
    const {online} = useUserOnline()

    const router = useRouter()
    const route = useRoute()

    const state = reactive({
      loginForm: {
        username: localStorage.getItem('username') ?? 'admin',
        password: '',
      },
      battery: {
        charging: false,
        chargingTime: 0,
        dischargingTime: 0,
        level: 100
      }
    })

    // 更新电池使用状态
    const updateBattery = (target) => {
      for (const key in state.battery) {
        state.battery[key] = target[key]
      }
      state.battery.level = state.battery.level * 100
    }

    // 计算电池剩余可用时间
    const calcDischargingTime = computed(() => {
      const hour = state.battery.dischargingTime / 3600
      const minute = state.battery.dischargingTime / 60 % 60
      return `${~~hour}小时${~~minute}分钟`
    })

    // 电池状态
    const batteryStatus = computed(() => {
      if (state.battery.charging && state.battery.level >= 100) {
        return '已充满'
      } else if (state.battery.charging) {
        return '充电中'
      } else {
        return '已断开电源'
      }
    })

    onMounted(async () => {
      const BatteryManager: Battery = await (window.navigator as any).getBattery()
      updateBattery(BatteryManager)
      console.log(BatteryManager, '电池')

      // 电池充电状态更新时被调用
      BatteryManager.onchargingchange = ({target}) => {
        updateBattery(target)
        console.log(target, '电池充电状态改变了')
      }
      // 电池充电时间更新时被调用
      BatteryManager.onchargingtimechange = ({target}) => {
        updateBattery(target)
        console.log(target, '电池充电了')
      }
      // 电池断开充电时间更新时被调用
      BatteryManager.ondischargingtimechange = ({target}) => {
        updateBattery(target)
        console.log(target, '电池断开充电了')
      }
      // 电池电量更新时被调用
      BatteryManager.onlevelchange = ({target}) => {
        updateBattery(target)
        console.log(target, '电量更新了')
      }

      // new Intl.DateTimeFormat('zh', {
      //   year: 'numeric',
      //   month: '2-digit',
      //   day: '2-digit',
      //   hour: '2-digit',
      //   minute: '2-digit',
      //   second: '2-digit',
      //   hour12: false
      // }).format(new Date())

    })

    // 登录
    const onLogin = async () => {
      const params = {...state.loginForm}
      params.password = md5(params.password)
      const result = await login(params) 
      if (result.code == 1) {
        message.success('登录成功！')
        emit('update:un-lock-login', false)
        emit('update:lock-time', 60 * 30)
        setIsLock(false)
        localStorage.setItem('username', params.username)
        localStorage.setItem('loginInfo', result.result)
        localStorage.setItem('errorInfo', '0')
      } else {
        message[result.type](result.message || '登录失败')
      }
    }

    const nav2login = () => {
      emit('update:un-lock-login', false)
      emit('update:lock-time', 60 * 30)
      router.replace({
        path: '/login',
        query: {
          redirect: route.fullPath
        }
      })
    }

    return {
      ...toRefs(state),
      online,
      month, day, hour, minute, second, week,
      batteryStatus,
      calcDischargingTime,
      onLogin,
      nav2login
    }
  }
})
</script>

<style lang="scss" scoped>
.lockscreen {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  background: #000;
  color: white;
  overflow: hidden;
  z-index: 9999;

  &.unLockLogin {
    background-color: rgba(25, 28, 34, 0.88);
    backdrop-filter: blur(7px);
  }

  .login-box {
    position: absolute;
    top: 45%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    > * {
      margin-bottom: 14px;
    }

    .username {
      font-size: 30px;
    }
  }

  .lock-box {
    position: absolute;
    top: 12vh;
    left: 50%;
    transform: translateX(-50%);
    font-size: 34px;

    .tips {
      color: white;
      cursor: text;
    }

    .lock {
      display: flex;
      justify-content: center;

      .lock-icon {
        cursor: pointer;

        .anticon-unlock {
          display: none;
        }

        &:hover .anticon-unlock {
          display: initial;
        }

        &:hover .anticon-lock {
          display: none;
        }
      }
    }
  }


  .local-time {
    position: absolute;
    bottom: 60px;
    left: 60px;
    font-family: helvetica;

    .time {
      font-size: 70px;
    }

    .date {
      font-size: 40px;
    }
  }

  .computer-status {
    position: absolute;
    bottom: 60px;
    right: 60px;
    font-size: 24px;

    > * {
      margin-left: 14px;
    }

    .network {
      position: relative;

      &.offline::before {
        content: '';
        position: absolute;
        left: 50%;
        top: 50%;
        width: 2px;
        height: 28px;
        transform: translate(-50%, -50%) rotate(45deg);
        background-color: red;
        z-index: 10;
      }
    }
  }
}

</style>
