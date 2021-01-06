<template>
  <div ref="rootEl">
    <a-modal
        v-model:visible="modalVisible"
        :title="'添加组用户' + (treeTitle ? `(${treeTitle})` : '')"
        :width="850"
        dialogClass="assign-user-modal"
        centered
        destroyOnClose
        :footer="null"
        @ok="modalVisible = false"
    >
      <dept-tree hide-operate @selected="selectedTree"/>
      <div class="right-content">
        <div class="user-table">
          <a-checkbox-group v-model:value="leftChecks" @change="val => leftChecks = val.slice(-1)">
            <a-table :columns="columns" :data-source="leftData" :pagination="false" rowKey="id" size="small">
              <template #username="{text, record}">
                <a-checkbox :value="record.id">
                  {{ text }}
                </a-checkbox>
              </template>
            </a-table>
          </a-checkbox-group>
          <div class="operation">
            <a-button @click="addToRight" :disabled="leftChecks.length == 0" type="primary" >
              <arrow-right-outlined/>
            </a-button>
            <a-button @click="addToLeft" :disabled="rightChecks.length == 0" type="primary">
              <arrow-left-outlined/>
            </a-button>
          </div>
          <a-checkbox-group v-model:value="rightChecks" @change="val => rightChecks = val.slice(-1)">
            <a-table :columns="columns" :data-source="rightData" :pagination="false" rowKey="id" size="small">
              <template #username="{text, record}">
                <a-checkbox :value="record.id">
                  {{ text }}
                </a-checkbox>
              </template>
            </a-table>
          </a-checkbox-group>
        </div>
        <div class="btn-row">
          <a-button @click="handleSubmit" type="primary">
            确定
          </a-button>
          <a-button @click="modalVisible = false">取消</a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import {Modal as AModal, Checkbox,Table, Button, message} from 'ant-design-vue'
import {ArrowRightOutlined,ArrowLeftOutlined} from '@ant-design/icons-vue'
import {defineComponent, inject, toRefs, reactive, onMounted} from 'vue'
import {ModalProps} from './props'
import {deptUsers} from "@/api/dept/";
import {watermarkAdd} from '@/api/watermark'
import {useEventbus} from "@/hooks/useEventbus";
import {DeptTree} from '@/components/dept-tree'

const columns = [
  {
    title: '用户名',
    dataIndex: 'username',
    key: 'username',
    slots: {customRender: 'username'},
  },
  {
    title: '姓名',
    dataIndex: 'cname',
    key: 'cname',
    slots: {customRender: 'cname'},
  }
]

export default defineComponent({
  name: "watermark-new",
  components: {
    AModal, DeptTree, [Checkbox.Group.name]: Checkbox.Group, [Table.name]: Table, [Checkbox.name]: Checkbox, [Button.name]: Button, ArrowLeftOutlined,ArrowRightOutlined
  },
  props: {
    groupId: {
      type: [Number, String]
    },
    treeTitle: {
      type: String,
      default: ''
    }
  },
  setup(props: any) {
    const {toRefreshTable} = useEventbus()
    const state = reactive({
      modalVisible: true,
      loading: false, // 按钮加载状态
      formInline: {
        name: '',
        reserved: '',
      },
      leftChecks: [],
      rightChecks: [],
      leftData: [],
      rightData: []
    })

    const selectedTree = async (deptID) => {
      console.log(deptID, 'tree 可以')
      const data = await deptUsers({}, deptID)
      state.leftData = data
    }

    // 添加到右边
    const addToRight = () => {
      const left = state.leftData.filter((item: any) => state.leftChecks.find(n => n == item.id))
      state.leftData = state.leftData.filter((item: any) => !state.leftChecks.find(n => n == item.id))
      // state.rightData.push(...left)
      state.leftData.push(...state.rightData)
      state.rightData = left
      state.leftChecks = []
    }

    // 添加到左边
    const addToLeft = () => {
      const left = state.rightData.filter((item: any) => state.rightChecks.find(n => n == item.id))
      state.rightData = state.rightData.filter((item: any) => !state.rightChecks.find(n => n == item.id))
      state.leftData.push(...left)
      state.rightChecks = []
    }

    const handleSubmit = async () => {
      console.log(state.formInline)
      state.loading = true
      const res = await watermarkAdd({uid: state.rightData.map((item: any) => item.id).toString(), gid: props.groupId}).finally(() => state.loading = false)
      if (res.code == 1) {
        message.success('添加成功')
        toRefreshTable()
      } else {
        message[res.type](res.message || '添加失败')
      }
      state.modalVisible = false
    }

    return {
      ...toRefs(state),
      columns,
      addToRight,
      addToLeft,
      selectedTree,
      handleSubmit
    }
  }
})
</script>

<style lang="scss">
.assign-user-modal {
  .ant-modal-body {
    display: flex;
    .tree-wrapper {
      width: 200px;
      max-height: 350px;
    }
    .right-content {
      flex: auto;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .user-table {
        display: flex;
        min-height: 250px;
        .ant-checkbox-group {
          flex: 1;
        }
        .operation {
          width: 70px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          button {
            margin-bottom: 10px;
          }
        }
      }
      .btn-row {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        padding-top: 14px;
      }
    }
  }
}
</style>
