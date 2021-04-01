import { get, del, put, post } from '@/plugins/modules/request'

export const getGoodsInfoList = params => get('/goods/goods-info-list', params)

export const getGoodsList = params => get('/goods/goods-list', params)

export const getGoodsDetail = params => get('/goods/goods-detail', params)

export const getMoreGoods = params => get('/goods/get-more-goods-list', params)

export const deleteGoods = goodsId => del('/goods/goods', { goodsId }, {
  showTip: true,
  tipMsg: '删除成功'
})

// 批量获取商品信息
export const batchGetGoodsInfo = params => get('/goods/goods-info-list', params)

// 更新商品信息
export const updateGoodsInfo = params => put('/goods/goods', params, {
  showTip: true,
  tipMsg: '更新成功'
})

export const addGoods = params => post('/goods/goods', params, {
  showTip: true,
  tipMsg: '新增商品成功'
})
