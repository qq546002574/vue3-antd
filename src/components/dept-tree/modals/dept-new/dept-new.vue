<template>
    <a-modal
        v-model:visible="modalVisible"
        title="新建部门"
        centered
        destroyOnClose
        :footer="null"
        @ok="modalVisible = false"
    >
      <a-form layout="horizontal" :model="formInline" v-bind="formItemLayout" @submit="handleSubmit" @submit.prevent>
        <a-form-item label="部门名称">
          <a-input v-model:value="formInline.name" placeholder="请输入部门名称">
          </a-input>
        </a-form-item>
        <a-form-item label="地址">
          <a-input v-model:value="formInline.office" placeholder="请输入地址">
          </a-input>
        </a-form-item>
        <a-form-item label="电话">
          <a-input v-model:value="formInline.tel" placeholder="请输入电话">
          </a-input>
        </a-form-item>
        <a-form-item label="传真">
          <a-input v-model:value="formInline.fax" placeholder="请输入传真">
          </a-input>
        </a-form-item>
        <a-form-item label="描述">
          <a-input v-model:value="formInline.description" placeholder="请输入描述">
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
</template>

<script lang="ts">
import {Modal as AModal, Input, Form as AForm, Button as AButton, Space as ASpace, message} from 'ant-design-vue'
import {defineComponent, ref, toRefs, reactive, SetupContext} from 'vue'
import {ModalProps} from './props'
import {deptNew} from "@/api/dept/";
import {useEventbus} from "@/hooks/useEventbus";

export default defineComponent({
  name: "dept-new",
  components: {
    AModal, AInput: Input, ATextarea: Input.TextArea, AForm, AFormItem: AForm.Item, AButton, ASpace
  },
  props: {
    fatherId: {
      type: String
    }
  },
  setup(props: ModalProps, ctx: SetupContext) {
    const {toRefreshTree, toRefreshTable} = useEventbus()
    const state = reactive({
      modalVisible: true,
      loading: false, // 按钮加载状态
      formInline: {
        fatherID: props.fatherId,
        name: '',
        tel: '',
        fax: '',
        office: '',
        description: '',
      },
      formItemLayout: {
        labelCol: { span: 5 },
        wrapperCol: { span: 19 },
      }
    })
    const handleSubmit = async () => {
      console.log(state.formInline)
      state.loading = true
      const res = await deptNew(state.formInline).finally(() => state.loading = false)
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
