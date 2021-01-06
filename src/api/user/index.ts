import http from '@/utils/http/axios';

enum Api {
    userRoleuser = '/user/roleuser',
    userChangedept = '/user/changedept',
    userPolicyList = '/user/policylist',
    userDecryptpolicy = '/user/decryptpolicy',
    userDelete = '/user/delete',
    userRemovefromrole = '/user/removefromrole',
    userDisk = '/user/disk',
    userGetPolicy = '/user/getpolicy',
    userDeptuser = '/user/deptuser',
    userSavedecryptpolicy = '/user/savedecryptpolicy',
    userAdd = '/user/add',
    userUsedefaultpolicy = '/user/usedefaultpolicy',
    userPolicylist = '/user/policylist', // 用户权限列表
    userGetdefaultpolicy = '/user/getdefaultpolicy', // 获取默认用户权限
    userSetdefaultpolicy = '/user/setdefaultpolicy', // 设置默认用户权限
}

/**
 * @description: 根据角色获取用户列表
 */
export function userRoleuser(params: any, deptId) {
    return http.request({
        url: Api.userRoleuser,
        method: 'POST',
        params,
    });
}
/**
 * @description: 设置默认用户策略
 */
export function userSetdefaultpolicy(params: any) {
    return http.request({
        url: Api.userSetdefaultpolicy,
        method: 'POST',
        params,
    }, {
        isShowMessage: true,
        successMessageText: '设置成功',
        errorMessageText: '操作失败'
    });
}
/**
 * @description: 应用默认用户策略
 */
export function userUsedefaultpolicy(params: any) {
    return http.request({
        url: Api.userUsedefaultpolicy,
        method: 'POST',
        params,
    }, {
        isShowMessage: true,
        successMessageText: '应用成功',
        errorMessageText: '操作失败'
    });
}
/**
 * @description: 获取默认用户权限
 */
export function userGetdefaultpolicy(params: any) {
    return http.request({
        url: Api.userGetdefaultpolicy,
        method: 'POST',
        params,
    });
}
/**
 * @description: 用户权限列表
 */
export function userPolicylist(params: any) {
    return http.request({
        url: Api.userPolicylist,
        method: 'POST',
        params,
    });
}
/**
 * @description: 新建用户
 */
export function userAdd(params: any) {
    return http.request({
        url: Api.userAdd,
        method: 'POST',
        params,
    }, {
        isShowMessage: true,
        successMessageText: '添加成功',
        errorMessageText: '添加失败'
    });
}
/**
 * @description: 更改用户所属部门
 */
export function userChangedept(params: any) {
    return http.request({
        url: Api.userChangedept,
        method: 'POST',
        params,
    }, {
        isTransformRequestResult: false
    });
}
/**
 * @description: 移动储存控制设置
 */
export function userDisk(params: any) {
    return http.request({
        url: Api.userDisk,
        method: 'POST',
        params,
    }, {
        isShowMessage: true,
        successMessageText: '操作成功',
        errorMessageText: '操作失败'
    });
}
/**
 * @description: 用户策略-部门成员
 */
export function userDeptuser(params: any) {
    return http.request({
        url: Api.userDeptuser,
        method: 'POST',
        params,
    });
}
/**
 * @description: 用户策略-保存选择的成员
 */
export function userSavedecryptpolicy(params: any) {
    return http.request({
        url: Api.userSavedecryptpolicy,
        method: 'POST',
        params,
    }, {
        isTransformRequestResult: false
    });
}
/**
 * @description: 获取用户策略
 */
export function userGetPolicy(params: any) {
    return http.request({
        url: Api.userGetPolicy,
        method: 'POST',
        params,
    }, {
        isTransformRequestResult: false
    });
}
/**
 * @description: 移动储存控制设置
 */
export function userUidPolicy(params: any, uid) {
    return http.request({
        url: `/user/u${uid}/policy`,
        method: 'POST',
        params,
    });
}
/**
 * @description: 用户策略列表
 */
export function userPolicyList(params: any) {
    return http.request({
        url: Api.userPolicyList,
        method: 'POST',
        params,
    });
}
/**
 * @description: 删除用户
 */
export function userDelete(params: any) {
    return http.request({
        url: Api.userDelete,
        method: 'POST',
        params,
    }, {
        isTransformRequestResult: false
    });
}
/**
 * @description: 将用户从权限表中移出
 */
export function userRemovefromrole(params: any) {
    return http.request({
        url: Api.userRemovefromrole,
        method: 'POST',
        params,
    }, {
        isTransformRequestResult: false
    });
}
/**
 * @description: 用户解密策略列表
 */
export function userDecryptpolicy(params: any) {
    return http.request({
        url: Api.userDecryptpolicy,
        method: 'POST',
        params,
    });
}
/**
 * @description: 根据UID查询单个用户基本信息
 */
export function userBase(params: any, roleId) {
    return http.request({
        url: `/user/${roleId}/base`,
        method: 'POST',
        params,
    });
}
/**
 * @description: 修改用户基本信息
 */
export function userSave(params: any, UID) {
    return http.request({
        url: `/user/u${UID}/save`,
        method: 'POST',
        params,
    }, {
        isTransformRequestResult: false
    });
}
