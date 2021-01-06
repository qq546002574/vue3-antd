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
        <a-form-item label="组名称">
          <a-input v-model:value="formInline.name" placeholder="请输组名称">
          </a-input>
        </a-form-item>
        <a-form-item label="备注">
          <a-input v-model:value="formInline.reserved" placeholder="备注信息">
          </a-input>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 19, offset: 5 }">
          <a-space :size="24">
          <a-button
              type="primary"
              html-type="submit"
              :loading="loading"
              :disabled="formInline.name === '' || formInline.office === ''"
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
import {Modal as AModal, Input, Form as AForm, Button as AButton, Space as ASpace, message} from 'ant-design-vue'
import {defineComponent, ref, toRefs, reactive, onMounted} from 'vue'
import {ModalProps} from './props'
import {watermarkNew} from "@/api/watermark/";
import {useEventbus} from "@/hooks/useEventbus";

export default defineComponent({
  name: "watermark-new",
  components: {
    AModal, AInput: Input, AForm, AFormItem: AForm.Item, AButton, ASpace
  },
  props: {
    title: {
      type: String,
      default: '添加用户组'
    },
    fatherId: {
      type: String
    }
  },
  setup(props) {
    const {toRefreshTree, toRefreshTable} = useEventbus()
    const state = reactive({
      modalVisible: true,
      loading: false, // 按钮加载状态
      formInline: {
        // fatherID: props.fatherId,
        name: '',
        reserved : '',
      },
      formItemLayout: {
        labelCol: { span: 5 },
        wrapperCol: { span: 19 },
      }
    })
    const handleSubmit = async () => {
      console.log(state.formInline)
      state.loading = true
      const res = await watermarkNew(state.formInline).finally(() => state.loading = false)
      if (res.code == 1) {
        message.success('添加成功')
        // 通知刷新树
        toRefreshTree()
        toRefreshTable()
      } else {
        message[res.type](res.message || '添加失败')
      }
      state.modalVisible = false
    }
    return {
      ...toRefs(state),
      handleSubmit
    }
  }
})
</script>

<style scoped>

</style>
