import {createRouter, createWebHistory} from 'vue-router'
import {UserStore} from '@/stores/module/UserStore'
import {ElNotification} from 'element-plus'
import {ProjectStore} from "@/stores/module/ProStore.js";
// import HomeView from '../views/HomeView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: '/login'
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/User/LoginView.vue'),
        },
        {
            path: '/project',
            name: 'project',
            component: () => import('../views/Pro/ProView.vue'),
        },

        {
            path: '/home',
            name: 'home',
            component: () => import('../views/Home/HomeView.vue'),
            redirect: '/project/env',
            children: [
                {
                    path: '/project/env',
                    name: 'env',
                    component: () => import('../views/Env/EnvView.vue'),
                    meta: {
                        name: "测试环境",
                    }
                },
                {
                    path: '/project/interface',
                    name: 'interface',
                    component: () => import('../views/Interface/InterfaceView.vue'),
                    meta: {
                        name: "接口列表",
                    }
                },
            ]
        }
    ],
})


router.beforeEach(async (to, from, next) => {
    const ustore = UserStore()
    const pstore = ProjectStore()
    let isLogin = ustore.$state.isLogin
    if (!isLogin && to.name != 'login') {
        ElNotification({
            title: '未登录',
            message: '用户未登录，请先登录！',
            type: 'warning',
            duration: 3000,
        })
        // 将用户重定向到登录页面
        // return { name: 'login' }
        next({name: 'login'})
    } else next()
    if (to.meta.name) {
        pstore.addTags(to)
    }

})


export default router
