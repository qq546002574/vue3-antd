<template>
  <a-button style="margin-top: 14px" type="primary" @click="showModal">添加</a-button>
  <a-modal
      v-model:visible="visible"
      title="添加用户"
      :width="600"
      @ok="handleOk"
      :confirm-loading="confirmLoading"
      :bodyStyle="bodyStyle"
      destroyOnClose>
    <a-tree
        style="max-height: 300px;overflow: auto"
        v-model:expandedKeys="expandedKeys"
        v-model:selectedKeys="selectedKeys"
        :load-data="onLoadData"
        :tree-data="deptTree"/>
    <a-checkbox-group style="display: block" v-model:value="checkedList" @change="onChange" >
    <a-table
        rowKey="id"
        :columns="tabColumns"
        :data-source="dataList"
        :pagination="false"
        size="small"
    >
<!--      <template #title>-->
<!--        <a-checkbox-->
<!--            v-model:checked="checkAll"-->
<!--            :indeterminate="indeterminate"-->
<!--            @change="onCheckAllChange"-->
<!--        >-->
<!--          全选-->
<!--        </a-checkbox>-->
<!--      </template>-->
      <template v-slot:depid="{text, record}">
        <a-checkbox :value="record.id">
        </a-checkbox>
      </template>
    </a-table>
    </a-checkbox-group>
  </a-modal>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, ref, watch, SetupContext} from 'vue'
import {deptTree} from "@/api/dept";
import { userSavedecryptpolicy} from "@/api/user";
import {deptUsers} from '@/api/dept'
import {message, Tree} from "ant-design-vue";
import {useEventbus} from "@/hooks/useEventbus";

export default defineComponent({
  name: "user-policy-modal",
  components: {[Tree.name]: Tree},
  emits: ['changedept-success'],
  props: {
    type: {
      type: [String,Number]
    },
    allType: {
      type: Boolean
    },
    checkList: {
      type: Object
    } as any
  },
  setup(props, {attrs, emit}: SetupContext) {
    const {toRefreshTable} = useEventbus()
    const state = reactive({
      deptTree: [],
      dataList: [],
      selectedKeys: [],
      confirmLoading: false,
      expandedKeys: [] as string[],
      visible: false,
      checkedList: [] as any[],
      indeterminate: true,
      checkAll: false
    })

    const tabColumns = [
      {
        title: '选项',
        dataIndex: 'depid',
        width: 60,
        slots: {customRender: 'depid'}
      },
      {
        title: '用户名',
        dataIndex: 'cname',
        slots: {customRender: 'cname'}
      },
      {
        title: '账号',
        dataIndex: 'username',
        slots: {customRender: 'username'}
      },
      {
        title: '所在部门',
        dataIndex: 'userpri',
        slots: {customRender: 'userpri'}
      },
      {
        title: '角色',
        dataIndex: 'roleid',
        slots: {customRender: 'roleid'}
      }
    ]
    const rowSelection = ref({
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      onSelect: (record, selected, selectedRows) => {
        console.log(record, selected, selectedRows);
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        console.log(selected, selectedRows, changeRows);
      },
    })

    const bodyStyle = {
      'max-height': '70vh',
      'min-height': '100px',
      overflow: 'auto'
    }

    watch(() => props.checkList, (value: any) => {
      state.checkedList = value[props.type + '']
    }, {
      immediate: true,
      deep: true
    })

    // 获取部门列表
    const getUserDeptuser = async (deptId) => {
      const result = await deptUsers({}, deptId)
      state.dataList = result || []
    }

    watch(() => state.selectedKeys, (value: any[]) => {
      console.log(value)
      getUserDeptuser(value.toString())
    })

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
      state.expandedKeys = [res[0].key]
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

    watch(() => state.checkedList, (value => {
      console.log(value, '选择的')
    }))

    const onChange = (checkedList) => {
      state.indeterminate = !!checkedList.length && checkedList.length < state.dataList.length;
      state.checkAll = checkedList.length === state.dataList.length;
    }
    const onCheckAllChange = (e) => {
      const ids = state.dataList.map((item: any) => item.id)
      console.log(ids, 'ids')
        state.checkedList = e.target.checked ? ids : []
      console.log(state.checkedList)
        state.indeterminate = false
    }

    const showModal = () => {
      state.visible = true;
    }

    const handleOk = async (e) => {
      const params = {
        user: attrs.uid,
        addlist: state.checkedList,
        dellist: state.dataList.filter((item: any) => !state.checkedList.includes(item.id)).map((item: any) => item.id),
        type: props.type,
        all: props.allType,
      }
      state.confirmLoading = true
      const res = await userSavedecryptpolicy(params)
      if (res.code == 1) {
        message.success('操作成功！')
        emit('changedept-success')
        toRefreshTable()
        state.visible = false;
      } else {
        message[res.type](res.message || '操作失败！')
      }
      state.confirmLoading = false
    }

    return {
      ...toRefs(state),
      bodyStyle,
      rowSelection,
      tabColumns,
      onLoadData,
      onChange,
      onCheckAllChange,
      showModal,
      handleOk
    }
  }
})
</script>

<style scoped>
</style>
