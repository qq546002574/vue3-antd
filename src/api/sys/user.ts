import http from '@/utils/http/axios';
import {
  LoginParams,
  LoginResultModel,
  GetUserInfoByUserIdParams,
  GetUserInfoByUserIdModel,
} from './model/userModel';

enum Api {
  login = '/admin/login',
  logout = '/admin/logout',
  validToken = '/admin/getObjectByToken'
}

/**
 * @description: 用户登录
 */
export function login(params: LoginParams) {
  return http.request({
    url: Api.login,
    method: 'POST',
    params,
  }, {
    isTransformRequestResult: false
  });
}

/**
 * @description: 用户修改密码
 */
export function changePassword(params, id) {
  return http.request({
    url: `/user/${id}/changepw`,
    method: 'POST',
    params,
  }, {
    isTransformRequestResult: false
  });
}

/**
 * @description: 用户登出
 */
export function logout(params) {
  return http.request({
    url: Api.logout,
    method: 'POST',
    params,
  }, {
    isTransformRequestResult: false
  });
}

/**
 * @description: token校验
 */
export function validByToken(params) {
  return http.request({
    url: Api.validToken,
    method: 'POST',
    params,
  }, {
    isTransformRequestResult: false
  });
}