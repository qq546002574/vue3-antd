<template>
  <a-spin :spinning="spinning">
    <a-form :model="form" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item label="当前组">
        {{ treeTitle }}--{{ tableTitle }}
      </a-form-item>
      <a-form-item label="水印颜色">
        <input v-model="form.fontcolor" type="color"/>
      </a-form-item>
      <a-form-item label="水印字体">
        <a-select v-model:value="form.fontname" placeholder="请选择字体">
          <a-select-option v-for="item in fontSelectedOptions" :key="item.label" :value="item.label">
            <span :style="{fontFamily: item.fontFamily}">{{ item.label }}</span>
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="字体大小">
        <a-row>
          <a-col :span="10">
            <a-slider v-model:value="form.fontsize" :min="0" :max="40"/>
          </a-col>
          <a-col :span="8">
            <a-input-number
                v-model:value="form.fontsize"
                :formatter="value => `${value}px`"
                :parser="value => value.replace('px', '')"
                :min="1" :max="40" style="marginLeft: 16px"/>
          </a-col>
          <a-col :span="6">
            <a-checkbox v-model:checked="form.auto">自动</a-checkbox>
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item v-if="route.meta.watermarkType == 'docmark'" label="透明度">
        <a-row>
          <a-col :span="10">
            <a-slider v-model:value="form.diaphaneity" :min="0" :max="100"/>
          </a-col>
          <a-col :span="4">
            <a-input-number
                v-model:value="form.diaphaneity"
                :formatter="value => `${value}%`"
                :parser="value => value.replace('%', '')"
                :min="0" :max="100" style="marginLeft: 16px"/>
          </a-col>
        </a-row>
      </a-form-item>
      <a-form-item label="显示样式">
        <a-radio-group v-model:value="form.layout">
          <a-radio v-for="(value, key) in styleSelectedOptions" :key="key" :value="~~key">
            {{ value }}
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="水印细节">
        <a @click="isShowDescription = !isShowDescription">{{ isShowDescription ? '收起' : '展开' }}</a>
        <div :class="{'show': isShowDescription}" class="desc-box">
          <a-checkbox-group v-model:value="checkeds" style="display: block;margin-bottom: 10px">
            <a-row>
              <a-col v-for="(value, key) in checkBoxs" :key="key" :span="10">
                <a-checkbox :value="~~key">
                  {{ value }}
                </a-checkbox>
              </a-col>
            </a-row>
          </a-checkbox-group>
          <a-row v-if="route.meta.watermarkType == 'docmark'">
            <a-col :span="6">
              水印条数：
            </a-col>
            <a-col :span="10">
              <a-slider v-model:value="form.tiaoshu" :min="1" :max="5"/>
            </a-col>
            <a-col :span="4">
              <a-input-number v-model:value="form.tiaoshu" :min="1" :max="5" style="marginLeft: 16px"/>
            </a-col>
          </a-row>
          <div>
            自定义内容:
          </div>
          <a-textarea v-model:value="form.text"/>
        </div>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button type="primary" @click="saveChange">
          保存修改
        </a-button>
      </a-form-item>
    </a-form>
  </a-spin>
</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, watch} from 'vue';
import {useRoute} from "vue-router";
import {Select, Slider, InputNumber, Col, Row, Input, Spin, message} from 'ant-design-vue'

import {
  styleSelectedOptions,
  checkBoxs,
  fontSelectedOptions
} from './options'

import {watermarkSetdm, watermarkSetfm, watermarkFileMark, watermarkDocMark} from '@/api/watermark'

// 默认的配置
const presetForm = {
  groudid: 1,
  userid: 0,
  fontcolor: '#000000' as string | number,
  fontname: '宋体',
  auto: true as boolean | number,
  fontsize: 0,
  layout: 3,
  diaphaneity: 0,
  text: 'Default',
  options: 0,
  tiaoshu: 0,
  proc: '',
}

export default defineComponent({
  name: 'watermark-info',
  components: {
    [Select.name]: Select,
    [Select.Option.name]: Select.Option,
    [Slider.name]: Slider,
    [InputNumber.name]: InputNumber,
    [Row.name]: Row,
    [Col.name]: Col,
    [Input.TextArea.name]: Input.TextArea,
    [Spin.name]: Spin
  },
  props: ['treeTitle', 'tableTitle', 'gid', 'uid'],
  setup(props) {
    const route = useRoute()

    const state = reactive({
      spinning: false, // 加载状态
      labelCol: {span: 4},
      wrapperCol: {span: 18},
      isShowDescription: false, // 是否展开
      checkeds: [], // 复选框
      form: {
        ...presetForm
      }
    })

    const sumOption = (): number => {
      let options = state.form.text.length > 0 ? 16 : 0
      state.checkeds.forEach(item => (options += parseInt(item)))
      return options
    }

    // 查询水印配置信息
    const queryWatermarkConfig = async () => {
      state.spinning = true
      let data: any
      // 打印水印
      if (route.meta.watermarkType == 'filemark') {
        data = await watermarkFileMark({gid: state.form.groudid, uid: state.form.userid}).finally(() => state.spinning = false)
      } else {
        data = await watermarkDocMark({gid: state.form.groudid, uid: state.form.userid}).finally(() => state.spinning = false)
      }
      console.log(data, '水印设置信息')
      if (data.code == 1) {
        const {result} = data
        state.form = {
          ...state.form,
          ...result.wmconfig
        }
        state.form.auto = result.wmconfig.auto == 1
        state.form.fontcolor = ('#' + (result.wmconfig.fontcolor).toString(16).padStart(6, '0'))
        console.log(state.form.fontcolor)
        state.checkeds = result.array
      } else {
        message.info('该组或用户尚未设置水印')
        state.form = {
          ...state.form,
          ...presetForm
        }
        state.form.userid = ~~props.uid
        state.form.groudid = ~~props.gid
      }
    }

    // 保存修改
    const saveChange = async () => {
      const params = {...state.form}
      params.fontcolor = parseInt((params.fontcolor as string).replace('#', '0x'), 16)
      params.options = sumOption()
      params.auto = params.auto ? 1 : 0
      const result = await (route.meta.watermarkType == 'filemark' ? watermarkSetfm(params) : watermarkSetdm(params))
      if (result.code == 1) {
        message.success('保存成功！')
      } else {
        message[result.type](result.message || '保存失败')
      }
      queryWatermarkConfig()
    }

    // 监听传过来的gid
    watch(() => props.gid, value => {
      state.form.groudid = ~~props.gid
      queryWatermarkConfig()
    }, {immediate: true})

    // 监听传过来的uid
    watch(() => props.uid, value => {
      state.form.userid = ~~props.uid
      queryWatermarkConfig()
    }, {immediate: true})

    // 监听传过来的gid
    watch(() => route.fullPath, value => {
      console.log(route.meta.watermarkType)
    }, {immediate: true})

    return {
      ...toRefs(state),
      route,
      styleSelectedOptions,
      checkBoxs,
      fontSelectedOptions,
      saveChange
    }
  },
});

</script>

<style lang="scss" scoped>
.desc-box {
  max-height: 0;
  overflow: hidden;
  transition: max-height .3s;

  &.show {
    max-height: 400px;
  }
}
</style>
