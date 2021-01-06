<template>
  <a-table bordered
           :scroll="{y: 'calc(100vh - 210px)'}"
           :columns="columns"
           :loading="loading"
           :pagination="false"
           rowKey="id"
           :data-source="dataList">
    <template #mac="{text, record}">
      {{ record.pid.slice(-12) }}
    </template>
    <template v-slot:cname="{text, record}">
      <router-link :to="`/object/role/${record.id}`">{{ record.cname }}</router-link>
    </template>
    <template v-slot:username="{text, record}">
      <router-link :to="`/object/role/${record.id}`">{{ record.username }}</router-link>
    </template>
    <template #userpri="{text, record}">
      <router-link :to="`/object/department/${record.depid}`">{{ record.userpri }}</router-link>
    </template>
    <template v-slot:roleid="{text, record}">
      {{ formatRole(record.roleid) }}
    </template>
    <template v-slot:actions="{text, record}">
      <a-popconfirm
          :title="params.user == 1 ? '用户将会被删除，是否继续？' : '用户将会变成普通用户，是否继续？'"
          placement="leftTop"
          @confirm="confirmRemove(record)"
      >
        <a>移出</a>
      </a-popconfirm>
    </template>
  </a-table>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, onMounted} from 'vue';

import {message, Popconfirm as APopconfirm} from 'ant-design-vue'

import {userDecryptpolicy, userRemovefromrole, userDelete} from '@/api/user'
import {useEventbus} from '@/hooks/useEventbus'

const temColumns = [
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
  },
  {
    title: '操作',
    dataIndex: 'actions',
    width: 80,
    slots: {customRender: 'actions'}
  }
]

interface ComponentProps {
  params: any;
}

export default defineComponent({
  name: 'table-data',
  components: { APopconfirm},
  props: {
    params: {
      type: Object,
      default: () => ({
        user: '',
        type: ''
      })
    } as any
  },
  setup(props: ComponentProps, {emit}) {
    const {refreshTable} = useEventbus()

    const state = reactive({
      loading: false,
      currentUid: 0,
      dataList: [],
    })
    const columns: Array<any> = temColumns

    const getTableData = async (id) => {
      state.loading = true
      const data = await userDecryptpolicy(props.params).finally(() => state.loading = false)
      state.dataList = data
      emit('load', data)
    }

    const formatRole = (roleid) => ({
      1: '普通用户',
      2: '控制台管理员',
      4: '分级管理员',
      8: '特权用户'
    }[roleid])

    onMounted(() => {
      refreshTable(() => getTableData(props.params))
      getTableData(props.params)
    })

    // 确认移出
    const confirmRemove = async (record) => {
      const params = {
        ID: record.id
      }
      let result: any = null
      if (props.params.user == 1) {
        result = await userDelete(params)
      } else {
        result = await userRemovefromrole(params)
      }
      if (result && result.code === 1) {
        message.success('操作成功')
        emit('reload')
      } else if (result) {
        message[result.type](result.message || '操作失败')
      }
    }

    // 卸载
    const delDept = async (record) => {
      console.log(record)
    }

    return {
      ...toRefs(state),
      columns,
      confirmRemove,
      formatRole,
      delDept,
    }
  },
});

</script>

<style lang="scss" scoped>
.table-title {
  margin: 0.5em;
}
</style>
