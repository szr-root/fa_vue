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
            tags: []
        }
    },
    actions: {
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