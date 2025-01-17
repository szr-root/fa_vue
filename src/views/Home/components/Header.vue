<template>
	<div class="head_box">
		<div class="left_box">
			<el-button icon="Fold"></el-button>
			<!-- 选择框 -->
			<el-select v-model="env" placeholder="请选择测试环境">
				<el-option v-for='item in evnList' :key="item.id" :label="item.name" :value="item.id" />
			</el-select>
		</div>
		<div class="center_box">
			接口测试平台
		</div>
		<div class="righr_box">
			
			<el-button plain icon="Switch" class='box2'> 切换项目 </el-button>
		
			<el-dropdown>
				<el-button plain icon="User" > John </el-button>
				<template #dropdown>
					<el-button plain icon="User" @click='logout'> 退出登录 </el-button>
				</template>			
			</el-dropdown>
			
		</div>
	</div>

</template>

<script>
</script>

<style lang='scss' scoped> 
	.head_box{
		
		height: 55px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		
		.left_box{
			flex:1;
			display: flex;
			align-items: center;
			height:55px;
			margin-right: 3px;
		}
		.center_box{
			height: 50px;
			width: 700px;
			line-height: 50px;
			text-align: center;
			font-weight: bold;
			font-size: 22px;
			color: #00aaff;
			flex-shrink: 0;
			border-radius: 10px;
			background: linear-gradient(120deg, #F3BA48 0%, #FEDC96 100%);
			margin-right: 3px;
		}
		.right_box{
			display: flex;
			display: flex;
			align-items: center;
			justify-content: right;
			padding-right: 20px;
	
		}
	}

</style>