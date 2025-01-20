import request from "@/api/request";

//导出请求方法
export default {
	//登录
	loginApi(data){
		return request.post('/api/users/login/',data)
	},
	getUserListApi(){
		return request.get('/api/users/users/')
	}
}
