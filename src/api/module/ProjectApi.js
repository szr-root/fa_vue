import request from "@/api/request";

//导出请求方法
export default {
	//获取项目列表
	getProListApi(){
		return request.get('/api/testPro/projects')
	},
	createProApi(data){
		return request.post('/api/testPro/projects',data)
	},
	editProApi(pro_id,data){
		return request.patch(`/api/testPro/editProject/${pro_id}`,data)
	},
	deleteProApi(pro_id){
		return request.delete(`/api/testPro/Projects/${pro_id}`)
	},
	getEnvListApi(pro_id){
		return request.get(`/api/testPro/envs`,{
			params:{
				project:pro_id
			}
		})
	},
	createEnvApi(data){
		return request.post('/api/testPro/envs',data)
	},
	deleteEnvApi(env_id){
		return request.delete(`/api/testPro/envs/${env_id}`)
	}
	
}
