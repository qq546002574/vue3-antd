<template>
  <div ref="rootEl">
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
          <a-input v-model:value="formInline.server" placeholder="Username">
          </a-input>
        </a-form-item>
        <a-form-item label="地址">
          <a-input v-model:value="formInline.username" placeholder="Username">
          </a-input>
        </a-form-item>
        <a-form-item label="电话">
          <a-input v-model:value="formInline.password" placeholder="Password">
          </a-input>
        </a-form-item>
        <a-form-item label="传真">
          <a-input v-model:value="formInline.port" placeholder="Password">
          </a-input>
        </a-form-item>
        <a-form-item label="传真">
          <a-input v-model:value="formInline.port" placeholder="Password">
          </a-input>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 19, offset: 5 }">
          <a-button
              type="primary"
              html-type="submit"
              :disabled="formInline.user === '' || formInline.password === ''"
              block
          >
            确定
          </a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
import {Modal as AModal, Input, Form as AForm, Button as AButton} from 'ant-design-vue'
import {defineComponent, ref, toRefs, reactive, onMounted} from 'vue'
import {ModalProps} from './props'
import {deptNew} from "@/api/dept/";
import router from "@/router";

export default defineComponent({
  name: "dept-new",
  components: {
    AModal, AInput: Input, ATextarea: Input.TextArea, AForm, AFormItem: AForm.Item, AButton
  },
  props: {
    fatherId: {
      type: String
    }
  },
  setup(props: ModalProps) {
    const state = reactive({
      modalVisible: true,
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
    const handleSubmit = () => {
      console.log(state.formInline)
      deptNew(state.formInline)
      router.replace('/')
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
