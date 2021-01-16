import http from '@/utils/http/axios';

enum Api {
    QuartzAll = '/quartz/list',
    QuartzInfo = '/quartz/',
}

/**
 * @description: 获取客户端列表
 */
export function quartzAll(params: any) {
    return http.request({
        url: Api.QuartzAll,
        method: 'POST',
        params,
    });
}

/**
 * @description: 获取任务详情
 */
export function quartzDetail(params: any, jobId) {
    return http.request({
        url: Api.QuartzInfo + jobId + '/base',
        method: 'POST',
        params,
    });
}

/**
 * @description: 更改终端别名
 */
export function updateBase(params: any) {
    return http.request({
        url: Api.QuartzInfo + '/updateBase',
        method: 'POST',
        params,
    }, {
        isTransformRequestResult: false
    });
}

/**
 * @description: 新增
 */
export function addQuartz(params: any) {
    return http.request({
        url: Api.QuartzInfo + '/add',
        method: 'POST',
        params,
    }, {
        isTransformRequestResult: false
    });
}

/**
 * @description: 卸载终端
 */
export function delQuartz(params: any) {
    return http.request({
        url: Api.QuartzInfo + '/delete',
        method: 'POST',
        params,
    }, {
        isTransformRequestResult: false
    });
}

/**
 * @description: 暂停
 */
export function pauseQuartz(params: any) {
    return http.request({
        url: Api.QuartzInfo + '/pause',
        method: 'POST',
        params,
    }, {
        isTransformRequestResult: false
    });
}

/**
 * @description: 恢复
 */
export function resumeQuartz(params: any) {
    return http.request({
        url: Api.QuartzInfo + '/resume',
        method: 'POST',
        params,
    }, {
        isTransformRequestResult: false
    });
}