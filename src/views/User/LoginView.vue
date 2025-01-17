<template>
	<div class="main">
		<div class="login_box">		
			<div class="head">
				<img src="@/assets/logo.jpeg" alt="logo" class="logo">
				<div class="title">接口自动化平台</div>
			</div>
			<div class="login-form" >
				  <el-form :model="loginForm" :rules="loginRules" ref='loginFormRef'>
				    <el-form-item prop="username">
				      <el-input prefix-icon="User" v-model="loginForm.username" 
								placeholder="请输入用户名"
					  />
				    </el-form-item>
					
					<el-form-item prop="password">
					  <el-input type="password" prefix-icon="Lock" v-model="loginForm.password" 
								placeholder="请输入密码"
					  />
					</el-form-item>
					
					<el-form-item>
					      <el-switch v-model="loginForm.status" inactive-text='记住登录状态' />
					</el-form-item>
					
				    <el-form-item>
				      <el-button :disabled='canClick' type="primary"  @click="LoginSubmit(loginFormRef)" style="width: 100%;">登 录</el-button>
				    </el-form-item>
					
					<el-link @click="router.push('register')" type="primary">没有账号？点击注册</el-link>
				  </el-form>
			</div>
		</div>
	</div>
</template>

<script setup>
	import {reactive,ref,computed,onBeforeMount} from 'vue'
	import http from '@/api/index'
	import { ElNotification,ElMessage} from 'element-plus'
	import{UserStore} from '@/stores/UserStore'
	import {useRouter} from 'vue-router'
	
	//创建路由对象
	const router = useRouter()
	
	//创建用户store对象
	const uStore = UserStore()
	
	const loginFormRef=ref(null)
	
	const loginForm = reactive({
		username:"",
		password:"",
		status:true	
	})
	const canClick = computed(()=>{
		if (loginForm.username!=='' && loginForm.password!==''){return false}
		else{return true}
		})
	
	//表单校验规则
	const loginRules = reactive({
		username: [
			{ required: true, message: '账号不能为空', trigger: 'blur' },
			{ min: 4, max: 18, message: '账号长度4-18位', trigger: 'blur' },
		],
		password :[
			{ required: true, message: '密码不能为空', trigger: 'blur' },
			{ min: 6, max: 18, message: '密码长度6-18位', trigger: 'blur' },
		]
	})
	
	const LoginSubmit = async(loginRef)=>{
		console.log('click!!!')
		//表单预校验
		await loginRef.validate(async (valid)=>{
			if(valid){
				const response = await http.user.loginApi(loginForm)
				if(response.status === 200){
					  ElNotification({
						title: '登录成功',
						message: '您已登录成功，进入首页',
						type: 'success',
						duration: 3000,
					  })
					  //保存用户token和用户信息
					  uStore.token = response.data.token
					  uStore.userinfo = response.data.user
					  // 修改认证状态
					  if(loginForm.status){
						  uStore.isLogin = true
					  }
					  // 跳转到home页面
					  router.push({name:"project"})
					}else{
						ElMessage({
							message: response.data.detail,
							type: 'error',
							duration: 3,
						})
					}
			}
		})
	}
	
	onBeforeMount(()=>{
		if(uStore.isLogin && uStore.token){
			ElMessage({
				message: '已登录，2s后跳转首页',
				type: 'info'
			})
			setTimeout(()=>{
				router.push('project')
			},2000)
		}
	})
</script>

<style scoped lang='scss'>
	.main{
		width: 100vw;
		height: 100vh;
		/* background: url('../assets/hz.svg'); */
		background: url('../../assets/bg.jpeg');
		background-size: cover;
		.login_box{
			width: 500px;
			height: 460px;
			box-shadow:  0 0 5px var(--el-color-primary);
			position:absolute;
			top:calc(50vh - 230px);
			left: calc(50vw - 250px);
			border-radius: 20px;
			background-color: rgba(255, 255, 255, 0.8);
		}
		.head{
			display: flex;
			justify-content: center;
			align-items: center;
			height: 150px;
			.logo{
				width: 60px;
				height: 60px;
				border-radius: 50px;
			}
			.title{
				font-size: 30px;
				font-weight: bold;
				color: var(--el-color-primary);
				margin-left: 20px;
			}
		}
		.login-form{
			margin: 0 30px;
		}
	}

</style>