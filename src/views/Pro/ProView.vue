<template>
	<div class="pro_page">
		<div class="pro_box">
			<div class="welcome">
				<span>欢迎使用自动化测试平台</span>
				<el-button icon="CirclePlus" size="small" @click='showDlg'>添加项目</el-button>
			</div>
			<div class="pro_list">			
				<el-carousel :interval="4000" type="card" height="400px" motion-blur>
					<el-carousel-item v-for="(item,index) in proList" :key="index">
						<div class="pro">
							<div @click='enterProject(item)'>
								<!-- 图片 -->
								<img src="@/assets/procard.jpg">
								<!-- 名称 -->
								<div class="name">
									{{item.name}}
								</div>
							</div>
							<!-- 按钮 -->
							<div class="btn_box1">
								<el-button @click='clickEdit(item)' plain icon='Edit' size="small"></el-button>
							</div>
							<div class="btn_box2">
								<el-button @click='clickDelete(item.id)' plain icon='Delete' size="small"></el-button>
							</div>
						</div>
					</el-carousel-item>
				</el-carousel>
		</div>
		<div class="iod">
			我觉得该写点什么，但是又不知道写点什么。
		</div>
		<div class="iod">
			只是觉得这样看起来这里很空旷，随便写点东西占个位置
		</div>
	</div>

</div>
</template>



<script setup>
	import {ref} from 'vue'
	import http  from '@/api/index'
 
	let proList = ref([])
	// console.log('1::',proList.value)
	async function getProjectList(){
		const resposne = await http.pro.getProListApi()
		if(resposne.status == 200){
			console.log(resposne.data)
			proList.value = resposne.data
		}
	}
	getProjectList()

</script>

<style lang='scss' scoped>
	@use './pro.scss';
</style>

