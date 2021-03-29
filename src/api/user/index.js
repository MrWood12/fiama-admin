import { get, post, del, put } from '@/plugins/modules/request'
import request from '@/utils/request'

/* eslint-disable */
export const login = ({
  email,
  password
}) => post('/user/admin-login', {
  email,
  password
}, {
  showTip: true,
  tipMsg: '登录成功',
  isAutoThrow: false
})

export const register = params => post('/user/register', params, {
  showTip: true,
  tipMsg: '注册成功，请重新登录'
})

export const resetPassword = params => post('/user/reset-password', params, {
  showTip: true,
  tipMsg: '修改密码成功'
})

export const checkFieldCanUse = params => post('/user/check-field-can-use', params)

export const updateUserInfo = params => post('/user/update-user-info', params, {
  showTip: true,
  tipMsg: '更新资料成功'
})

export const addAddress = params => post('/user/address', params, {
  showTip: true,
  tipMsg: '新增地址成功'
})

export const getAddress = () => get('/user/address')

export const updateAddress = params => put('/user/address', params, {
  showTip: true,
  tipMsg: '修改地址成功'
})

export const deleteAddress = params => del('/user/address', params, {
  showTip: true,
  tipMsg: '删除地址成功'
})

export const getCommentLikeList = () => get('/user/comment-like-list')

export const getGoodsLikeList = () => get('/user/goods-like-list', null, {
  isAutoThrow: false
})

// 给商店点赞
export const likeForGoods = params => post('/user/goods-like', params)

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
