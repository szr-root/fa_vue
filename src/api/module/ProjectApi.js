import request from "@/api/request";

//导出请求方法
export default {
	//获取项目列表
	getProListApi(){
		return request.get('/api/testPro/projects')
	}
	
	
}
