<template>
  <div class="client-info">
    <a-radio-group v-model:value="value">
      <a-radio @click.prevent="onChange('自动审批', 1)" :value="1">
        自动审批
      </a-radio>
      <a-radio @click.prevent="onChange('手动审批', 0)" :value="0">
        手动审批
      </a-radio>
    </a-radio-group>
  </div>
</template>

<script lang="ts">
import {defineComponent, createVNode, reactive, toRefs} from 'vue'
import {message, Radio, Modal} from 'ant-design-vue'
import {ExclamationCircleOutlined} from '@ant-design/icons-vue'
import {DeptSetapprove} from "@/api/dept";

export default defineComponent({
  name: "operate",
  components: {[Radio.name]: Radio, [Radio.Group.name]: Radio.Group},
  setup(props, {attrs}) {
    const state = reactive({
      value: 0
    })

    const onChange = async (title, value) => {

      Modal.confirm({
        title: `确定设置为${title}吗?`,
        icon: createVNode(ExclamationCircleOutlined),
        onOk: async () => {
          const result = await DeptSetapprove({deptID: attrs.deptId, value})
          return new Promise( (resolve, reject) => {
            if (result.code == 1) {
              message.success('设置成功')
              state.value = value
              resolve()
            } else {
              message[result.type](result.message || '设置失败')
              reject()
            }
          }).catch(() => console.log('Oops errors!'));
        }
      })
    }

    return {
      ...toRefs(state),
      onChange
    }
  }
})
</script>

<style scoped>

</style>
