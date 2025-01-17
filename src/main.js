import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersist from 'pinia-plugin-persist'

import App from './App.vue'
import router from './router'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

//语言国际化
import zhCn from 'element-plus/es/locale/lang/zh-cn'

//icon组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'



const app = createApp(App)

//注册element-plus语言国际化
app.use(ElementPlus, {
  locale: zhCn,
})

//注册elemnt-plus的icon组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}


// 创建一个pinia
const upinia = createPinia()

// 将持久化的插件注册到pinia中
upinia.use(piniaPluginPersist)

app.use(upinia)
app.use(router)

app.mount('#app')
