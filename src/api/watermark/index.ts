import http from '@/utils/http/axios';
import {ContentTypeEnum} from '@/enums/httpEnum'

// /watermark/users gid 查询组内用户
// /watermark/others gid 查询非组内用户
// /watermark/add gid uid 添加组用户
// /watermark/remove uid 移除组用户
// /watermark/del gid 删除水印组

enum Api {
    watermarkGroup = '/watermark/group', // 获取水印组
    watermarkUsers = '/watermark/users', // 获取水印组用户
    watermarkOthers = '/watermark/others', // 查询非组内用户
    watermarkAdd = '/watermark/add', // 添加组用户
    watermarkRemove = '/watermark/remove', // 移除组用户
    watermarkFileMark = '/watermark/filemark', // 获取文档水印配置
    watermarkDocMark = '/watermark/docmark', // 获取打印水印配置
    watermarkNew = '/watermark/new', // 新建水印组
    watermarkSetdm = '/watermark/setdm', // 设置文档水印
    watermarkSetfm = '/watermark/setfm', // 设置打印水印
    watermarkDel = '/watermark/del', // 删除水印组
}

/**
 * @description: 获取水印组
 */
export function watermarkGroup(params: any) {
    return http.request({
        url: Api.watermarkGroup,
        method: 'POST',
        params,
    });
}
/**
 * @description: 获取水印组用户
 */
export function watermarkUsers(params: any) {
    return http.request({
        url: Api.watermarkUsers,
        method: 'POST',
        params,
    });
}
/**
 * @description: 移除组用户
 */
export function watermarkRemove(params: any) {
    return http.request({
        url: Api.watermarkRemove,
        method: 'POST',
        params,
    }, {
        isTransformRequestResult: false
    });
}
/**
 * @description: 获取非组内用户
 */
export function watermarkOthers(params: any) {
    return http.request({
        url: Api.watermarkOthers,
        method: 'POST',
        params,
    });
}
/**
 * @description: 添加水印组用户
 */
export function watermarkAdd(params: any) {
    return http.request({
        url: Api.watermarkAdd,
        method: 'POST',
        params,
    }, {
        isTransformRequestResult: false
    });
}
/**
 * @description: 获取文档水印配置
 */
export function watermarkFileMark(params: any) {
    return http.request({
        url: Api.watermarkFileMark,
        method: 'POST',
        params,
    }, {
        isTransformRequestResult: false
    });
}
/**
 * @description: 获取打印水印配置
 */
export function watermarkDocMark(params: any) {
    return http.request({
        url: Api.watermarkDocMark,
        method: 'POST',
        params,
    }, {
        isTransformRequestResult: false
    });
}
/**
 * @description: 新建水印组
 */
export function watermarkNew(params: any) {
    return http.request({
        url: Api.watermarkNew,
        method: 'POST',
        params,
    }, {
        isTransformRequestResult: false
    });
}
/**
 * @description: 设置文档水印
 */
export function watermarkSetfm(params: any) {
    return http.request({
        url: Api.watermarkSetfm,
        method: 'POST',
        params,
        headers: {
            'Content-type': ContentTypeEnum.JSON
        }
    }, {
        isTransformRequestResult: false,
        isParseToJson: true
    });
}
/**
 * @description: 设置文档水印
 */
export function watermarkSetdm(params: any) {
    return http.request({
        url: Api.watermarkSetdm,
        method: 'POST',
        params,
        headers: {
            'Content-type': ContentTypeEnum.JSON
        }
    }, {
        isTransformRequestResult: false,
        isParseToJson: true
    });
}
/**
 * @description: 删除水印组
 */
export function watermarkDel(params: any) {
    return http.request({
        url: Api.watermarkDel,
        method: 'POST',
        params,
    }, {
        isTransformRequestResult: false
    });
}
