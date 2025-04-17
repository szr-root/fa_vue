import userApi from '@/api/module/UserApi'
import projectApi from '@/api/module/ProjectApi'
import runApi from '@/api/module/RunApi'

export default {
	//用户模块接口
	user: userApi,
	//项目模块接口
	pro: projectApi,
	//运行相关的接口
	run:runApi,

}