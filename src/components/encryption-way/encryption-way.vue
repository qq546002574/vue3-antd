<template>
  <a-radio-group v-model:value="type" name="type">
    <a-radio value="0">
      自动加密
    </a-radio>
    <a-radio value="256">
      手动加密
    </a-radio>
  </a-radio-group>
  <br/>
  <a-checkbox-group v-model:value="checkeds" name="checks">
    <a-checkbox value="128">
      扩展名不匹配禁止加密
    </a-checkbox>
    <a-checkbox :disabled="type == 256" value="64">
      使用加密副本
    </a-checkbox>
  </a-checkbox-group>
</template>

<script lang="ts">
import {defineComponent, watch, reactive, toRefs} from 'vue'

interface Props {
  policysum: number;
  sum: number;
  checked: string[];
}

export default defineComponent({
  name: "encryption-way",
  props: {
    sum: {
      type: Number
    },
    checked: {
      type: Array
    },
    policysum: {
      type: Number
    }
  },
  setup(props: Props, {emit}) {

    const state = reactive({
      type: '',
      checkeds: [] as string[]
    })
    // 计算总数
    const calcSum = () => {
      console.log(state.checkeds, '进入计算')
      const checks = [...state.checkeds]
      const index = checks.findIndex((item: string) => item == '64')
      // 自动加密并且没有勾选加密副本
      if (index == -1 && state.type == '0') {
        checks.push('3')
      }
      if (state.type == '256' && index != -1) {
        checks.splice(index, 1)
      }

      emit('update:checked', state.checkeds)
      emit('update:sum', checks.reduce((acc, curr) => ~~acc + ~~curr, ~~state.type))
    }

    watch(() => props.policysum, (value, oldValue) => {
      state.checkeds = []
      state.type = (256 & props.policysum) == 0 ? '0' : '256'
      if (state.type == '0') { // 自动加密
        if (0 != (64 & props.policysum)) { // 加密副本
          !state.checkeds.includes('64') && state.checkeds.push('64')
        }
      }
      if (0 != (128 & props.policysum)) { // 扩展名不匹配禁止加密
        !state.checkeds.includes('128') && state.checkeds.push('128')
      }
      calcSum()
    }, {
      immediate: true
    })

    watch(() => [state.checkeds, state.type], calcSum)

    return {
      ...toRefs(state)
    }
  }
})
</script>

<style scoped>
</style>
