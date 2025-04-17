import request from "@/api/request.js";


export default {
    runInterFaceCaseApi(params) {
        return request.post('/api/TestInterFace/cases/run/', params)
    },

}
