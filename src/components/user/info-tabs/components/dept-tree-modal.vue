<template>
  <a-button type="primary" @click="showModal">选择部门</a-button>
  <a-modal
      v-model:visible="visible"
      title="选择部门"
      @ok="handleOk"
      :confirm-loading="confirmLoading"
      :bodyStyle="bodyStyle"
      destroyOnClose>
    <a-tree v-model:expandedKeys="expandedKeys" v-model:selectedKeys="selectedKeys" :load-data="onLoadData" :tree-data="deptTree"/>
  </a-modal>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, SetupContext} from 'vue'
import {deptTree} from "@/api/dept";
import {userChangedept} from "@/api/user";
import {message, Tree} from "ant-design-vue";

export default defineComponent({
  name: "dept-tree-modal",
  components: {[Tree.name]: Tree},
  setup(props, {attrs, emit}: SetupContext) {
    const state = reactive({
      deptTree: [],
      selectedKeys: [],
      confirmLoading: false,
      expandedKeys: [] as string[],
      visible: false
    })

    const bodyStyle = {
      'max-height': '50vh',
      'min-height': '100px',
      overflow: 'auto'
    }

    // 获取部门树
    const getDeptTree = async () => {
      const res = await deptTree({})
      console.log(res);
      res[0] = {
        title: res[0].deptType,
        key: res[0].deptId
      }
      // res[0].children = res.splice(1).map(item => ({
      //   key: item.id,
      //   title: item.dname,
      // }))
      state.deptTree = res
      state.expandedKeys = [res[0].key]
    }

    getDeptTree()

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

    const showModal = () => {
      state.visible = true;
    }

    const handleOk = async (e) => {
      state.confirmLoading = true
      const res = await userChangedept({user: attrs.uid, dept: state.selectedKeys.toString()})
      if (res.code == 1) {
        message.success('更换部门成功！')
        emit('changedept-success')
        state.visible = false;
      } else {
        message[res.type](res.message || '操作失败！')
      }
      state.confirmLoading = false
    }

    return {
      ...toRefs(state),
      bodyStyle,
      onLoadData,
      showModal,
      handleOk
    }
  }
})
</script>

<style scoped>
</style>
