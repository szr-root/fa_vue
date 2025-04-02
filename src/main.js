import './assets/main.css'

import { createApp } from 'vue'
import pinia from '@/stores/index'

import App from './App.vue'
import router from './router'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

//语言国际化
import zhCn from 'element-plus/es/locale/lang/zh-cn'

//icon组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

//引入全局css
import './style/global.scss'

// 导入暗黑模式主题
import 'element-plus/theme-chalk/dark/css-vars.css'

const app = createApp(App)

//注册element-plus语言国际化
app.use(ElementPlus, {
  locale: zhCn,
})

//注册elemnt-plus的icon组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}


app.use(pinia)
app.use(router)

app.mount('#app')
