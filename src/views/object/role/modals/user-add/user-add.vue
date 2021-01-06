<template>
  <div ref="rootEl">
    <a-modal
        v-model:visible="modalVisible"
        title="新建用户"
        centered
        destroyOnClose
        :footer="null"
    >
      <a-form ref="ruleForm" layout="horizontal" :model="formInline" :rules="rules" v-bind="formItemLayout"
              @finish="handleFinish"
              @finishFailed="handleFinishFailed" @submit.prevent>
        <a-form-item label="账号">
          <a-input v-model:value="formInline.username" placeholder="请输入账号">
          </a-input>
        </a-form-item>
        <a-form-item required has-feedback name="password" label="密码">
          <a-input v-model:value="formInline.password" type="password" autocomplete="new-password"/>
        </a-form-item>
        <a-form-item has-feedback name="checkPassword" label="确认密码">
          <a-input v-model:value="formInline.checkPassword" type="password" autocomplete="new-password"/>
        </a-form-item>
        <a-form-item label="姓名">
          <a-input v-model:value="formInline.cname" placeholder="请输入姓名"/>
        </a-form-item>
        <a-form-item label="电话">
          <a-input v-model:value="formInline.tel" placeholder="请输入电话"/>
        </a-form-item>
        <a-form-item label="部门">
          <a-select
              v-model:value="formInline.dename"
          >
            <template v-slot:dropdownRender>
              <div style="min-height: 200px" @mousedown="e => e.preventDefault()">
                <a-tree style="height: 300px;overflow: auto"
                        @select="onSelect" :load-data="onLoadData"
                        :tree-data="deptTree"/>
              </div>
              <div style="display: flex;justify-content: flex-end;padding: 5px">
                <a-space :size="12">
                  <a-button @click="selectedDepartment" size="small" type="primary">确认</a-button>
                  <a-button size="small">取消</a-button>
                </a-space>
              </div>
            </template>
          </a-select>
        </a-form-item>
        <a-form-item :colon="false" label="  ">
          <a-checkbox v-model:checked="formInline.needKeylogin">
            Key验证登陆
          </a-checkbox>
          <a-checkbox :disabled="!formInline.needKeylogin" v-model:checked="formInline.notneddkey">
            非必须
          </a-checkbox>
          <a-checkbox v-model:checked="formInline.status">
            禁用用户
          </a-checkbox>
        </a-form-item>
        <a-form-item label="介绍">
          <a-textarea v-model:value="formInline.description" placeholder="部门介绍"/>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 19, offset: 5 }">
          <a-space :size="24">
            <a-button
                type="primary"
                html-type="submit"
                :loading="loading"
                :disabled="formInline.username === '' || formInline.password === ''"
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

import {defineComponent, ref, toRefs, reactive} from 'vue'
import {ModalProps} from './props'
import {useEventbus} from "@/hooks/useEventbus";
import {deptTree} from "@/api/dept";
import {userAdd} from '@/api/user'
import {message} from "ant-design-vue";
import md5 from 'blueimp-md5'

import components from './components'

export default defineComponent({
  name: "user-add",
  components: {...components},
  props: {
    fatherId: {
      type: String
    }
  },
  setup(props: ModalProps) {
    const {toRefreshTable} = useEventbus()
    const ruleForm = ref(null) as any
    const state = reactive({
      modalVisible: true,
      loading: false, // 按钮加载状态
      deptTree: [],
      selectedNode: null as any,
      formInline: {
        username: '',
        password: '',
        checkPassword: '' as any,
        cname: '',
        tel: '' as number | string,
        depid: '' as number | string,
        dename: '' as any,
        needKeylogin: false as boolean | number,
        notneddkey: false as boolean | number,
        status: false as boolean | number,
        description: ''
      },
      formItemLayout: {
        labelCol: {span: 5},
        wrapperCol: {span: 19},
      }
    })

    const validatePass = async (rule, value) => {
      if (value === '') {
        return Promise.reject('请输入密码');
      } else {
        if (state.formInline.checkPassword !== '') {
          ruleForm.value.validateField('checkPassword');
        }
        return Promise.resolve();
      }
    }
    const validatePass2 = async (rule, value, callback) => {
      if (value === '') {
        return Promise.reject('请输入确认密码');
      } else if (value !== state.formInline.password) {
        return Promise.reject("两次输入的密码不匹配!");
      } else {
        return Promise.resolve();
      }
    }
    // 验证规则
    const rules = ref({
      password: [{validator: validatePass, trigger: 'change'}],
      checkPassword: [{validator: validatePass2, trigger: 'change'}]
    })

    // 完成输入
    const handleFinish = async (values) => {
      console.log(values);
      console.log(state.formInline)
      state.loading = true
      state.formInline.dename = undefined
      state.formInline.checkPassword = undefined
      state.formInline.needKeylogin = state.formInline.needKeylogin ? 1 : 0
      state.formInline.notneddkey = state.formInline.notneddkey ? 1 : 0
      state.formInline.status = state.formInline.status ? 0 : 1
      state.formInline.password = md5(state.formInline.password)
      await userAdd(state.formInline).finally(() => state.loading = false)
      state.modalVisible = false
      // 通知刷新表格
      toRefreshTable()
    }
    const handleFinishFailed = (errors) => {
      console.log(errors);
    }

    // 选择部门
    const selectedDepartment = () => {
      state.formInline.dename = state.selectedNode?.dataRef?.title || ''
      state.formInline.depid = state.selectedNode?.eventKey || ''
    }

    const onSelect = (selectedKeys: any, info: any) => {
      const {node} = info
      state.selectedNode = node;
    }

    // 获取部门树
    const getDeptTree = async (depid) => {
      const res = await deptTree({ID: depid})
      res[0] = {
        title: res[0].dname,
        key: res[0].id
      }
      res[0].children = res.splice(1).map(item => ({
        key: item.id,
        title: item.dname,
      }))
      state.deptTree = res
    }

    getDeptTree(1)

    const onLoadData = (treeNode) => {
      return new Promise(resolve => {
        if (treeNode.dataRef.children) {
          resolve();
          return;
        }
        (async () => {
          const res = await deptTree({ID: treeNode.eventKey})
          treeNode.dataRef.children = res.map(item => ({
            title: item.dname,
            key: item.id
          }))
          state.deptTree = [...state.deptTree];
          resolve();
        })()
      });
    }

    return {
      ...toRefs(state),
      ruleForm,
      rules,
      selectedDepartment,
      onSelect,
      onLoadData,
      handleFinish,
      handleFinishFailed
    }
  }
})
</script>

<style scoped>

</style>
