<template>
  <div class="edit-form">
    <a-spin :spinning="spinning">
      <a-form layout="horizontal" :model="form" v-bind="formItemLayout" @submit="handleSubmit" @submit.prevent>
        <a-breadcrumb>
          当前选中：
          <a-breadcrumb-item>{{ selectedNames.name || '---' }}</a-breadcrumb-item>
          <a-breadcrumb-item>{{ selectedNames.type || '---' }}</a-breadcrumb-item>
        </a-breadcrumb>
        <a-divider orientation="left">
          加密选项
        </a-divider>
        <a-form-item label="加密方式">
          <encryption-way v-model:sum="sum" v-model:checked="checked" :policysum="form.policysum" />
        </a-form-item>
        <a-divider orientation="left">
          进程属性
        </a-divider>
        <a-form-item label="进程名称">
          <a-textarea v-model:value="form.processname" placeholder="进程名称">
          </a-textarea>
        </a-form-item>
        <a-form-item :label="checked.includes('128') ? '扩展名' : '加密副本'">
          <a-textarea v-model:value="form.externname" :placeholder="checked.includes('128') ? '扩展名' : '加密副本'">
          </a-textarea>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 19, offset: 5 }">
          <a-button
              type="primary"
              html-type="submit"
              :disabled="!form.policytype && !form.applicationid"
          >
            添加
          </a-button>
          <a-button @click="delAppPolicy" :disabled="disabled && !processid">
            删除
          </a-button>
          <a-button @click="setAppPolicy" :disabled="disabled && !processid">
            修改
          </a-button>
        </a-form-item>
      </a-form>
    </a-spin>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, watch, createVNode} from 'vue'

import {Divider, message, Modal, Breadcrumb, Spin} from 'ant-design-vue'
import {appDel, appAdd, appSet, appProc} from '@/api/policy'
import {ExclamationCircleOutlined} from '@ant-design/icons-vue'
import {EncryptionWay} from '@/components/encryption-way'

interface FormProps {
  processid: string | number;
  disabled: boolean;
  selectedNames?: object;
}

export default defineComponent({
  name: "edit-form",
  components: {
    EncryptionWay,ADivider: Divider, [Breadcrumb.name]: Breadcrumb, [Breadcrumb.Item.name]: Breadcrumb.Item, [Spin.name]: Spin
  },
  props: {
    processid: {
      type: [Number, String],
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    selectedNames: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props: FormProps, {emit}) {
    const state = reactive({
      spinning: false, // 加载状态
      sum: 0, // 加密方式计算值
      checked: [], // 勾选的类型
      selectedNames: {
        type: '',
        name: ''
      },
      form: {
        applicationid: '',
        externname: "",
        policytype: "",
        policyname: '',
        policysum: 0,
        processid: props.processid,
        processname: ""
      },
      formItemLayout: {
        labelCol: {span: 5},
        wrapperCol: {span: 19},
      }
    })

    // 获取进程详情
    const getAppProc = async (processid) => {
      if (processid == '') return
      state.spinning = true
      const data = await appProc({id: processid}).finally(() => state.spinning = false)
      // console.log(value, '表单')
      state.form.policyname ??= state.form.policyname
      // console.log(state.form, '表单')
      state.form = {
        ...state.form,
        ...data
      }
      state.form.processid = processid
    }

    watch(() => props.selectedNames, (names: any) => {
      console.log(names, 'names')
      state.selectedNames.type = names.type
      state.selectedNames.name = names.name
      state.form.applicationid = names.applicationid
    })

    watch(() => props.processid, (value: any) => getAppProc(value))

    const delAppPolicy = () => {
      Modal.confirm({
        title: '确定要删除该进程策略吗？',
        centered: true,
        icon: createVNode(ExclamationCircleOutlined),
        okType: 'danger',
        onOk: async () => {
          const res = await appDel({id: state.form.processid})
          console.log(res, '删除结果')
          if (res.code == 1) {
            message.success('删除成功！')
            emit('delete-row', state.form.processid)
            state.form.processid = ''
          } else {
            message.info(res.message)
          }
        },
      })
    }

    // 添加
    const handleSubmit = async () => {
      const {processid, processname, externname, applicationid} = state.form

      const params = {
        id: applicationid,
        'processname': processname,
        'extension': externname,
        'sum': state.sum
      }
      const res = await appAdd(params)
      if (res.code == 1) {
        message.success('添加成功！')
        emit('add-row', true)
      } else {
        message.info(res.message)
      }
      console.log(state.form)
    }

    // 修改
    const setAppPolicy = async () => {
      const {processid, processname, externname} = state.form

      const params = {
        'id': processid,
        'processname': processname,
        'extension': externname,
        'sum': state.sum
      }
      const res = await appSet(params)
      if (res.code == 1) {
        message.success('修改成功！')
        getAppProc(processid)
        emit('edit-row', processid)
      } else {
        message.info(res.message)
      }
    }

    return {
      ...toRefs(state),
      delAppPolicy,
      setAppPolicy,
      handleSubmit
    }
  }
})
</script>

<style lang="scss" scoped>
.edit-form {
  ::v-deep(.ant-form) {
    padding: 18px;

    .ant-form-item-label {
      padding-right: 6px;
    }

    .ant-form-item:last-of-type {
      .ant-form-item-children {
        display: flex;
        justify-content: space-around;
      }
    }
  }
}
</style>
