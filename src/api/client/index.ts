import http from '@/utils/http/axios';

enum Api {
    ClientAll = '/client/all',
    ClientInfo = '/client/',
}

/**
 * @description: 获取客户端列表
 */
export function clientAll(params: any) {
    return http.request({
        url: Api.ClientAll,
        method: 'POST',
        params,
    });
}

/**
 * @description: 获取客户端详情
 */
export function clientBase(params: any, pid) {
    return http.request({
        url: Api.ClientInfo + 'c' + pid + '/base',
        method: 'POST',
        params,
    });
}

/**
 * @description: 更改终端别名
 */
export function clientRename(params: any, pid) {
    return http.request({
        url: Api.ClientInfo + 'c' + pid + '/rename',
        method: 'POST',
        params,
    }, {
        isTransformRequestResult: false
    });
}

/**
 * @description: 通过验证
 */
export function clientApprove(params: any, pid) {
    return http.request({
        url: `${Api.ClientInfo}c${pid}/approve`,
        method: 'POST',
        params,
    }, {
        isTransformRequestResult: false
    });
}

/**
 * @description: 卸载终端
 */
export function clientUninstall(params: any, pid) {
    return http.request({
        url: Api.ClientInfo + 'c' + pid + '/uninstall',
        method: 'POST',
        params,
    }, {
        isTransformRequestResult: false
    });
}

/**
 * @description: 获取客户端部门详情
 */
export function clientDept(params: any, pid) {
    return http.request({
        url: Api.ClientInfo + 'c' + pid + '/dept',
        method: 'POST',
        params,
    });
}

/**
 * @description: 获取客户端操作
 */
export function clientOperate(params: any, pid) {
    return http.request({
        url: Api.ClientInfo + pid + '/operate',
        method: 'POST',
        params,
    });
}
