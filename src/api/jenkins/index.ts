import http from '@/utils/http/axios';

enum Api {
    JenkinsAll = '/jenkins/getAll',
    JenkinsInfo = '/jenkins/',
}

/**
 * @description: 获取客户端列表
 */
export function jenkinsAll(params: any) {
    return http.request({
        url: Api.JenkinsAll,
        method: 'POST',
        params,
    });
}

/**
 * @description: 获取客户端详情
 */
export function clientBase(params: any, id) {
    return http.request({
        url: Api.JenkinsInfo + id + '/base',
        method: 'POST',
        params,
    });
}

/**
 * @description: 更改终端别名
 */
export function updateBase(params: any) {
    return http.request({
        url: Api.JenkinsInfo + '/updateBase',
        method: 'POST',
        params,
    }, {
        isTransformRequestResult: false
    });
}

/**
 * @description: 通过验证
 */
export function jenkinsDo(params: any, id) {
    return http.request({
        url: `${Api.JenkinsInfo}${id}/do`,
        method: 'POST',
        params,
    }, {
        isTransformRequestResult: false
    });
}

/**
 * @description: 卸载终端
 */
export function delJenkins(params: any, id) {
    return http.request({
        url: Api.JenkinsInfo + id + '/delJenkins',
        method: 'POST',
        params,
    }, {
        isTransformRequestResult: false
    });
}

/**
 * @description: 获取客户端部门详情
 */
// export function clientDept(params: any, pid) {
//     return http.request({
//         url: Api.JenkinsInfo + 'c' + pid + '/dept',
//         method: 'POST',
//         params,
//     });
// }

/**
 * @description: 获取客户端操作
 */
export function addJenkins(params: any) {
    return http.request({
        url: Api.JenkinsInfo + '/addJenkins',
        method: 'POST',
        params,
    }, {
        isTransformRequestResult: false
    });
}
