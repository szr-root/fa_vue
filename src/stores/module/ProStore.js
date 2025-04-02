import {defineStore} from "pinia"
import http from '@/api/index'

export const ProjectStore = defineStore('proStore',{
	state:() => {
		return {
			pro : {},
			envList: [],
			isCollapse:false,
			// 顶部选中的测试环境
			env: null,
		}
	},
	actions:{
		async getEnvList(){
			const response = await http.pro.getEnvListApi(this.pro.id)
			if (response.status === 200) {
				this.envList = response.data
			}
		}
	},
	
	persist:{
		enabled:true,
		strategies:[
			{
				key:'proInfo',
				storage:localStorage
			}
		]
	}
})