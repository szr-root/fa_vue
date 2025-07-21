import request from "@/api/request";

export default {
    //创建测试业务流
    createFlowApi(params){
        return request.post('/api/TestFlow/flows',params)
    },
    //获取测试业务流
    getFlowListApi(pro_id){
        return request.get('/api/TestFlow/flows',{
            params: {
                project: pro_id
            }
        })
    },
    //删除测试业务流
    deleteFlowApi(suite_id){
        return request.delete(`/api/TestFlow/flows/${suite_id}`)
    },

    //修改测试业务流
    updateFlowApi(suite_id,params){
        return request.patch(`/api/TestFlow/flows/${suite_id}`,params)
    },

    //修改测试业务流中用例执行顺序
    updateFlowCaseOrderApi(params){
        return request.patch(`/api/TestFlow/cases_order`,params)
    },
    //获取测试业务流中用例
    getFlowCaseListApi(suite_id){
        return request.get(`/api/TestFlow/flows/cases`,{
            params: {
                scene: suite_id
            }
        })
    },
    //向测试业务流中添加测试用例
    addFlowCaseApi(params){
        return request.post(`/api/TestFlow/flows/cases`,params)
    },

    //将用例从业务流中删除
    deleteFlowCaseApi(case_id){
        return request.delete(`/api/TestFlow/flows/cases/${case_id}`)
    },


}