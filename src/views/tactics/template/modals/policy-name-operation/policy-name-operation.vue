<template>
  <div ref="rootEl">
    <a-modal
        v-model:visible="modalVisible"
        :title="title"
        centered
        destroyOnClose
        :footer="null"
        @ok="modalVisible = false"
    >
      <a-form layout="horizontal" :model="formInline" v-bind="formItemLayout" @submit="handleSubmit" @submit.prevent>
        <a-form-item :label="label">
          <a-input v-model:value="formInline.name" @compositionstart="onChange" @compositionend="onChange" placeholder="请输入名称">
          </a-input>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 19, offset: 5 }">
          <a-button
              type="primary"
              html-type="submit"
              :loading="loading"
              :disabled="formInline.name === ''"
          >
            确定
          </a-button>
          <a-button @click="modalVisible = false" style="margin-left: 20px">
            取消
          </a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
import {Modal as AModal, Input, Form as AForm, Button as AButton, message} from 'ant-design-vue'
import {defineComponent, ref, toRefs, reactive, SetupContext, PropType} from 'vue'
import {ModalProps} from './props'

export default defineComponent({
  name: "policy-name-operation",
  components: {
    AModal, AInput: Input, AForm, AFormItem: AForm.Item, AButton
  },
  props: {
    id: { // 需要修改或者添加子项的id
      type: [String, Number]
    },
    title: { // 模态框标题
      type: String,
      default: '策略名称'
    },
    label: { // 表单标签名
      type: String,
      default: '名称'
    },
    defaultValue: { // 表单标签名
      type: String,
      default: ''
    },
    reqMethod: Function as PropType<(params: any) => Promise<any>>,
    callback: (...rest) => rest
  },
  setup(props: any, context: SetupContext) {
    const state = reactive({
      modalVisible: true,
      loading: false,
      formInline: {
        id: props.id,
        name: props.defaultValue,
      },
      formItemLayout: {
        labelCol: { span: 5 },
        wrapperCol: { span: 19 },
      }
    })
    const handleSubmit = async () => {
      console.log(state.formInline)
      console.log(props, '接受到的')
      state.loading = true
      const res = await props.reqMethod(state.formInline).finally(() => state.loading = false)
      if (res.code == 1) {
        props.callback && props.callback(res)
        message.success('操作成功！')
        context.emit('callback', state.formInline.name)
      } else {
        message.error('操作失败')
      }
      state.modalVisible = false
    }

    const onChange = (e) => {
      state.formInline.name = e.target.value
    }

    return {
      ...toRefs(state),
      handleSubmit,
      onChange
    }
  }
})
</script>

<style scoped>

</style>
