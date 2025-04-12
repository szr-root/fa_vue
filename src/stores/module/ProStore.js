import {defineStore} from "pinia"
import http from '@/api/index'

export const ProjectStore = defineStore('proStore', {
    state: () => {
        return {
            pro: {},
            envList: [],
            isCollapse: false,
            // 顶部选中的测试环境
            env: null,
            //历史访问记录
            tags: [],
            // 保存接口列表
			interfaces: [],
        }
    },
    getters: {
		// 项目接口
		interfaces1() {
			return this.interfaces.filter((item) => {
				return item.type == '1'
			})
		},
		// 第三方接口
		interfaces2() {
			return this.interfaces.filter((item) => {
				return item.type == '2'
			})
		},
	},

    actions: {
        // 获取项目下面所以的接口
		async getInterFaceList() {
			const response = await http.pro.getInterFaceListApi(this.pro.id)
			if (response.status === 200) {
				this.interfaces = response.data
			}
		},

        async getEnvList() {
            const response = await http.pro.getEnvListApi(this.pro.id)
            if (response.status === 200) {
                this.envList = response.data
            }
        },
        addTags(to) {
            const res = this.tags.find(item => {
                return to.path === item.path
            })
            if (!res) {
                this.tags.push({
                    path: to.path,
                    name: to.meta.name,
                })
            }
        },
        delTags(path) {
            this.tags = this.tags.filter(item => {
                return item.path !== path
            })
        }
    },

    persist: {
        enabled: true,
        strategies: [
            {
                key: 'proInfo',
                storage: localStorage
            }
        ]
    }
})