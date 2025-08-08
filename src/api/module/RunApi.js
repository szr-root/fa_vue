import request from "@/api/request.js";


export default {
    runInterFaceCaseApi(params) {
        return request.post('/api/TestInterFace/cases/run/', params)
    },

    //运行业务流
    runFlowApi(params){
        return request.post(`/api/TestFlow/flows/run`,params)
    },

    //运行任务
    runTaskApi(params){
        return request.post(`/api/TestTask/tasks/run`,params)
    }
}
