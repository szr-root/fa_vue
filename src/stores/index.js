import { createPinia } from 'pinia'

import piniaPluginPersist from 'pinia-plugin-persist'

// 创建一个pinia示例
const pinia = createPinia()

// 将持久化的插件注册到pinia中
pinia.use(piniaPluginPersist)

export default pinia