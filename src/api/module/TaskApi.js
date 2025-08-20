import request from "@/api/request";

export default {
    //获取任务列表
    getTaskListApi(project_id) {
        return request.get('/api/TestTask/tasks', {
            params: {
                project: project_id
            }
        })
    },
    // 创建任务
    createTaskApi(params) {
        return request.post('/api/TestTask/tasks', params)
    },
    // 删除任务
    deleteTaskApi(id) {
        return request.delete(`/api/TestTask/tasks/${id}`)
    },
    // 添加业务流到任务中(修改测试任务)
    updateTaskApi(task_id, params) {
        return request.patch(`/api/TestTask/tasks/${task_id}`, params)
    },
    // 获取任务详情
    getTaskInfoApi(id) {
        return request.get(`/api/TestTask/tasks/${id}`)
    },
    // 获取记录
    getRecordsApi(params) {
        return request.get(`/api/TestTask/records`, {
            params: params
        })
    },
    // 获取测试报告
    getTaskReportApi(record_id) {
        return request.get(`/api/TestTask/report/${record_id}`)
    },

    // 获取单个测试记录详情
    getRecordsInfoApi(record_id) {
        return request.get(`/api/TestTask/records/${record_id}`)
    },

    //发送报告到飞书
    sendReportApi(record_id) {
        return request.post(`/api/TestTask/send_report`, {
            record_id: record_id
        })
    },

    //============================== 定时任务相关 ============================
    //  获取定时任务列表
    getCronListApi(project_id) {
        return request.get('/api/crontab/cronjob', {
            params: {
                project: project_id
            }
        })
    },

    //创建定时任务
    createCronApi(params) {
        return request.post('/api/crontab/cronjob', params)
    },

    //恢复/暂停 定时任务
    updateCronApi(id) {
        return request.patch(`/api/crontab/cronjob/${id}`)
    },

    //修改定时任务
    updateCronConfigApi(id, params) {
        return request.patch(`/api/crontab/cronjob/${id}`, params)
    },

    //删除定时任务
    deleteCronApi(id) {
        return request.delete(`/api/crontab/cronjob/${id}`)
    },
}