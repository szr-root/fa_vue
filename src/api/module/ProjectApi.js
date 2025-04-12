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
	},
	updateEnvApi(env_id,data){
		return request.patch(`/api/testPro/envs/${env_id}`,data)
	},
    
	// ===================== 接口相关 =======================
	// 添加接口
	createInterFaceApi(params) {
		return request.post('/api/TestInterFace/interfaces/', params)
	},
	// 获取接口列表
	getInterFaceListApi(pro_id) {
		return request.get('/api/TestInterFace/interfaces/', {
			params: {
				project: pro_id
			}
		})
	},
	// 编辑接口
	editInterFaceApi(id, params) {
		return request.patch(`/api/TestInterFace/interfaces/${id}/`, params)
	},
	// 删除接口
	deleteInterFaceApi(id) {
		return request.delete(`/api/TestInterFace/interfaces/${id}/`)
	},
}
