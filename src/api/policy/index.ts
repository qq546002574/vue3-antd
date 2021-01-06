import http from '@/utils/http/axios';

enum Api {
    AppAdd = '/app/add',
    AppBymodule = '/app/bymodule',
    AppDel = '/app/del',
    AppSet = '/app/set',
    AppProc = '/app/proc',
    PolicyAdd = '/policy/add',
    PolicyDel = '/policy/del',
    PolicyAll = '/policy/all',
    PolicySet = '/policy/set',
    ModuleAdd = '/module/add',
    ModuleDel = '/module/del',
    ModuleSet = '/module/set',
    ModuleBypolicy = '/module/bypolicy',
}

/**
 * @description: 添加策略
 */
export function appAdd(params: any) {
    return http.request({
        url: Api.AppAdd,
        method: 'POST',
        params,
    }, {
        isTransformRequestResult: false
    });
}
/**
 * @description: 新建策略名称
 */
export function policyAdd(params: any) {
    return http.request({
        url: Api.PolicyAdd,
        method: 'POST',
        params,
    }, {
        isTransformRequestResult: false
    });
}
/**
 * @description: 删除策略名称
 */
export function policyDel(params: any) {
    return http.request({
        url: Api.PolicyDel,
        method: 'POST',
        params,
    }, {
        isTransformRequestResult: false
    });
}
/**
 * @description: 获取策略列表
 */
export function policyAll(params: any) {
    return http.request({
        url: Api.PolicyAll,
        method: 'POST',
        params,
    });
}
/**
 * @description: 修改策略名称
 */
export function policySet(params: any) {
    return http.request({
        url: Api.PolicySet,
        method: 'POST',
        params,
    }, {
        isTransformRequestResult: false
    });
}
/**
 * @description: 新建加密类型
 */
export function moduleAdd(params: any) {
    return http.request({
        url: Api.ModuleAdd,
        method: 'POST',
        params,
    }, {
        isTransformRequestResult: false
    });
}
/**
 * @description: 修改加密类型
 */
export function moduleSet(params: any) {
    return http.request({
        url: Api.ModuleSet,
        method: 'POST',
        params,
    }, {
        isTransformRequestResult: false
    });
}
/**
 * @description: 删除加密类型
 */
export function moduleDel(params: any) {
    return http.request({
        url: Api.ModuleDel,
        method: 'POST',
        params,
    }, {
        isTransformRequestResult: false
    });
}
/**
 * @description: 查询策略列表（二级模块）
 */
export function moduleBypolicy(params: any) {
    return http.request({
        url: Api.ModuleBypolicy,
        method: 'POST',
        params,
    });
}
/**
 * @description: 查询进程列表
 */
export function appBymodule(params: any) {
    return http.request({
        url: Api.AppBymodule,
        method: 'POST',
        params,
    });
}
/**
 * @description: 修改单个进程
 */
export function appSet(params: any) {
    return http.request({
        url: Api.AppSet,
        method: 'POST',
        params,
    }, {
        isTransformRequestResult: false
    });
}
/**
 * @description: 删除单个进程
 */
export function appDel(params: any) {
    return http.request({
        url: Api.AppDel,
        method: 'POST',
        params,
    }, {
        isTransformRequestResult: false
    });
}
/**
 * @description: 查询单个进程信息
 */
export function appProc(params: any) {
    return http.request({
        url: Api.AppProc,
        method: 'POST',
        params,
    });
}
