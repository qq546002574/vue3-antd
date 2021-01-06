<template>
  <split-panel style="height: calc(100vh - 298px);">
    <template v-slot:left-content>
      <a-spin style="height: 280px" :spinning="treeIsLoad" tip="加载中">
        <a-tree
            v-model:checkedKeys="checkedKeys"
            checkable
            auto-expand-parent
            checkStrictly
            treeDefaultExpandAll
            :tree-data="treeData"
            @select="selectedTree"
            @check="checkTreeNode"
        />
      </a-spin>
    </template>
    <template v-slot:right-content>
      <a-form layout="horizontal" :model="form" v-bind="formItemLayout" @submit="handleSubmit" @submit.prevent style="padding: 0 18px">
        <a-form-item label-align="left" :wrapper-col="{  }" :colon="false">
          <div>当前选中：{{ currentSelected }}</div>
          <a-table
              size="small"
              :loading="loading"
              bordered
              :customRow="customRow"
              :columns="columns"
              :data-source="appModules"
              :pagination="false"
              row-key="processid"
              :scroll="{ y: 200 }"
          >
            <template v-slot:options="{text, record}">
              <span>{{ formatOptions(record) }}</span>
            </template>
          </a-table>
        </a-form-item>
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
          <a-textarea v-model:value="form.processname" disabled placeholder="进程名称">
          </a-textarea>
        </a-form-item>
        <a-form-item :label="checked.includes(128) ? '加密副本' : '扩展名'">
          <a-textarea v-model:value="form.processextern" disabled :placeholder="checked.includes(128) ? '加密副本' : '扩展名'">
          </a-textarea>
        </a-form-item>
        <a-form-item :wrapper-col="{ span: 19, offset: 5 }">
          <a-button
              type="primary"
              html-type="submit"
              :disabled="!isSelectedTableItem || form.processname == '' && form.applicationid == ''"
          >
            保存修改
          </a-button>
        </a-form-item>
      </a-form>
    </template>
  </split-panel>
</template>

<script lang="ts">
import {defineComponent, onMounted, reactive, toRefs, nextTick} from 'vue'
import {Divider, Tree, Spin, message} from 'ant-design-vue'
import {EncryptionWay} from '@/components/encryption-way'
import SplitPanel from '@/components/split-panel/index.vue'
import {deptPolicy,DeptProclist,DeptPolicyList, deptModuleList, deptModule, deptChangeprocess, appByModule, deptProc, deptSetpolicy} from "@/api/dept";
import {formatOptions} from '@/views/tactics/template/components/utils'


export default defineComponent({
  name: "dept-policy",
  components: {SplitPanel, [Divider.name]: Divider, [Tree.name]: Tree, [Spin.name]: Spin, EncryptionWay},
  setup(props, {attrs}) {

    const state = reactive({
      checkedKeys: [] as any[],
      sum: 0, // 加密方式计算值
      checked: [], // 勾选的类型
      treeData: [],
      loadedKeys: [],
      currentSelected: '-- --> --',
      isSelectedTableItem: false,
      appModules: [],
      loading: false,
      treeIsLoad: false, // 树加载状态
      form: {
        applicationid: '',
        classid: '',
        departmentid: '',
        policyid: '',
        policysum: 0,
        processextern: "",
        processid: '',
        processname: ""
      },
      formItemLayout: {
        labelCol: {span: 5},
        wrapperCol: {span: 19},
      }
    })

    let applicationid = ''

    const columns = [
      {
        title: '进程名',
        dataIndex: 'processname'
      },
      {
        title: '扩展名',
        dataIndex: 'externname'
      },
      {
        title: '策略选项',
        dataIndex: 'options',
        key: 'options',
        slots: {customRender: 'options'}
      }
    ]

    // 获取到真实的key
    const getKey = (nodeKey) => nodeKey.replace(/appid-|classid-/g, '')

    onMounted(async () => {
      state.treeIsLoad = true
      // 部门策略中policy列表
      const policyList = await DeptPolicyList({deptID: attrs.deptId})
      // 部门策略已选中的policy列表
      const policy = await deptPolicy({deptID: attrs.deptId})
      // 部门策略中已选中的module列表
      const module = await deptModule({deptID: attrs.deptId})
      // const result = await deptIdPolicy({}, attrs.deptId).finally(() => state.treeIsLoad = false)

      // 选中的
      const moduleSelected = module.map(item => 'appid-' + item.applicationid)
      const policySelected = policy.map(item => 'classid-' + item.classid)

      console.log(state.checkedKeys, '嗯哼 ')
      const promises = policyList.map(async item => {
        const obj = {
          title: item.classname,
          key: 'classid-' + item.classid,
          children: []
        }
          const modules = await deptModuleList({policy: item.classid ,deptID: attrs.deptId})
          obj.children = modules.map(n => ({
            title: n.applicationname,
            key: 'appid-' + n.applicationid,
            isLeaf: true,
            children: []
          }))
        return obj
      })
      const arr: any = await Promise.allSettled(promises).finally(() => state.treeIsLoad = false)
      state.treeData = arr.filter(item => item.status == "fulfilled").map(item => item.value)
      state.checkedKeys = [...moduleSelected, ...policySelected]
    })

    const getAppModule = async (applicationid) => {
      state.loading = true
      const result = await DeptProclist({module : applicationid, deptID: attrs.deptId}).finally(() => state.loading = false)
      state.appModules = result
    }

    // 选中树节点
    const selectedTree = (selectedKeys, info) => {
      const {node} = info
      state.isSelectedTableItem = false
      state.form.processid = ''
      if (node.pos.split('-').length > 2) {
        state.currentSelected = node.vcTreeNode.dataRef.title + '-->' + node.dataRef.title
        applicationid = node.eventKey.replace(/appid-|classid-/g, '')
        getAppModule(applicationid)
      }
    }
    // 勾选树节点
    const checkTreeNode = (checkedKeys, info) => {
      const {node} = info
      const params = {
        "id": node.eventKey.replace(/appid-|classid-/g, ''),
        "type": node.pos.split('-').length > 2 ? 'module' : 'policy',
        "deptID":attrs.deptId,
        "param": !node.checked
      }
      if (node.eventKey.includes('appid')) {
        console.log(node.vcTreeNode, 'node.vcTreeNode')
        if (!node.checked && !node.vcTreeNode.checked) {
          (Array.isArray(state.checkedKeys) ? state.checkedKeys : (state.checkedKeys as any).checked).push(node.vcTreeNode.eventKey)
          // node.vcTreeNode.checked = true
          const params = {
            "id": getKey(node.vcTreeNode.eventKey),
            "type": 'policy',
            "deptID":attrs.deptId,
            "param": true
          }
          deptSetpolicy(params)
        }
      }
      console.log(node, '节点')
      // state.checkedKeys = Array.isArray(checkedKeys) ? checkedKeys : checkedKeys.checked
      if (node.eventKey.includes('classid')) {
        // 如果选中
        if (!node.checked) {
          node.children.forEach(item => item.checked = true)
          const keys = node.children.map(item => item.key)
          Array.isArray(state.checkedKeys) ? state.checkedKeys.push(...keys) :  (state.checkedKeys as any).checked.push(...keys)
          // state.checkStrictly = false
          keys.forEach(key => {
            const params = {
              "id": key.replace(/appid-|classid-/g, ''),
              "type": 'module',
              "deptID":attrs.deptId,
              "param": !node.checked
            }
            deptSetpolicy(params)
          })
        } else {
          node.children.forEach(item => item.checked = false)
          const keys = node.children.map(item => item.key)
          state.checkedKeys = Array.isArray(state.checkedKeys) ? state.checkedKeys.filter(key => !keys.includes(key)) :  (state.checkedKeys as any).checked.filter(key => !keys.includes(key))
          // state.checkStrictly = false
          keys.forEach(key => {
            const params = {
              "id": getKey(key),
              "type": 'module',
              "deptID":attrs.deptId,
              "param": !node.checked
            }
            deptSetpolicy(params)
          })
        }
      }
      deptSetpolicy(params)
    }

    const getDeptProc = async (processid) => {
      const result = await deptProc({id: processid, deptID: attrs.deptId})
      state.form = {
        ...state.form,
        ...result
      }
    }

    // 提交修改
    const handleSubmit = async () => {
      const {processid} = state.form
      const params = {
        "process": processid,
        "department": attrs.deptId,
        "sum": state.sum
      }
      await deptChangeprocess(params)
      getAppModule(applicationid)
      console.log(state.form)
    }

    const customRow = record => ({
      class: {
        click: state.form.processid == record.processid
      },
      onclick: async e => {
        e.preventDefault();
        e.stopPropagation()
        state.isSelectedTableItem = true
        getDeptProc(record.processid)
      }
    })

    // 加载树节点
    const onLoadData = (treeNode) => {
      console.log(treeNode, '节点')
      return new Promise(resolve => {
        if (treeNode.dataRef.children) {
          treeNode.dataRef.isLeaf = true
          resolve();
          return;
        }
        (async () => {
          const modules = await deptModuleList({policy: getKey(treeNode.eventKey) ,deptID: attrs.deptId})
          treeNode.dataRef.children = modules.map(n => ({
            title: n.applicationname,
            key: 'appid-' + n.applicationid,
            isLeaf: true,
            children: []
          }))
          resolve();
        })()
        // state.treeData = [...state.treeData];
      });
    }

    return {
      ...toRefs(state),
      columns,
      onLoadData,
      formatOptions,
      customRow,
      checkTreeNode,
      selectedTree,
      handleSubmit,
      getDeptProc
    }
  }
})
</script>

<style lang="scss" scoped>
::v-deep(.click) > td {
  background-color: #e6f7ff;
}
::v-deep(.left-content) {
  padding-left: 0!important;
}
</style>
