import { createRouter, createWebHistory } from 'vue-router'
import {UserStore} from '@/stores/UserStore'
import { ElNotification} from 'element-plus'
// import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
	{
	  path:'/',
	  redirect:'/login'
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
	  // redirect: '/project/testenv',
	  children: [{
	  		path: '/project/testenv',
	  		name: 'test_env',
	  		component: () => import('../views/Env/EnvView.vue'),
	  		meta: {
	  			name: "测试环境",
	  		}
	  	}
		]
	}
  ], 
})


router.beforeEach(async(to,from,next)=>{
	const ustore = UserStore()
	let isLogin = ustore.$state.isLogin
	if(!isLogin && to.name != 'login'){
		ElNotification({
			title: '未登录',
			message: '用户未登录，请先登录！',
			type: 'warning',
			duration: 3000,
		})
		// 将用户重定向到登录页面
		// return { name: 'login' }
		next({name: 'login' })
	}
	else next()
})



export default router
