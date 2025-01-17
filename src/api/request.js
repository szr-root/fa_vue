import axios from "axios";

//创建axios请求对象
const request = axios.create({
	baseURL:"http://127.0.0.1:8000",
	timeout:10000,
	headers:{
		'Content-Type':"application/json"
	},
	validateStatus:function(status){
		//return status >= 200 && status < 300;
		return true
	},
	//允许发送跨域请求
	crossDomain:true,
	
	// `withCredentials` 表示跨域请求时是否需要使用凭证
	withCredentials: false, // default
})

// 添加请求拦截器
request.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });


// 添加响应拦截器
request.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  });
  

export default request

