import './publicPath'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router/'
// import store from './store'
import {SvgIcon} from '@/components/svg-icon'
import 'dayjs/locale/zh-cn'

import {Modal, Table, Menu, Input, Button, Form, Checkbox, Radio} from 'ant-design-vue';
import 'ant-design-vue/components/style.js';

const app = createApp(App)

// app.config.globalProperties.$message = message
// 常用的ant-design-vue组件
app.component(Modal.name, Modal)
app.component(Table.name, Table)
app.component(Input.name, Input)
app.component(Input.Search.name, Input.Search)
app.component(Input.TextArea.name, Input.TextArea)
app.component(Button.name, Button)
// app.component(Form.name, Form)
// app.component(Form.Item.name, Form.Item)
app.use(Form)
app.use(Menu)
app.use(Checkbox)
app.use(Radio)

app.use(router)

router.isReady().then(() => app.mount('#app'))

// app.config.devtools = true
