import {ref, onMounted, onUnmounted, watch} from 'vue'
import {useRoute} from "vue-router";


/**
 * @description 设置是否锁屏
 * @param value
 */
export function setIsLock(value: boolean) {
    localStorage.setItem('isLock', value + '')
}

/**
 * @description 用户长时间未操作页面
 */
export function useUserLeave() {

    const initTime = 60 * 30
    const route = useRoute()
    let timer
    // 锁屏倒计时
    const lockTime = ref(localStorage.getItem('isLock') == 'true' ? 0 : initTime)

    const timekeeping = () => {
        lockTime.value = initTime
        clearInterval(timer)
        if (route.name == 'login') return
        setIsLock(false)
        timer = setInterval(() => {
            if (--lockTime.value <= 0) {
                setIsLock(true)
                return clearInterval(timer)
            }
        }, 1000)
    }

    watch(() => route.fullPath, value => {
        if (route.name == 'login') {
            lockTime.value = initTime
            clearInterval(timer)
        }
    }, {immediate: true})

    onMounted(() => {
        document.addEventListener('mousedown', timekeeping)
    })

    onUnmounted(() => {
        document.removeEventListener('mousedown', timekeeping)
    })

    return {lockTime}
}

/**
 * @description 用户网络是否可用
 * */
export function useUserOnline() {
    const online = ref(true)

    const showStatus = (val) => {
        online.value = typeof val == 'boolean' ? val : val.target.online
    }

// 在页面加载后，设置正确的网络状态
    navigator.onLine ? showStatus(true) : showStatus(false)

    onMounted(() => {
        // 开始监听网络状态的变化
        window.addEventListener('online', showStatus)

        window.addEventListener('offline', showStatus)
    })
    onUnmounted(() => {
        // 移除监听网络状态的变化
        window.removeEventListener('online', showStatus)

        window.removeEventListener('offline', showStatus)
    })

    return {online}
}
