import { get, del } from '@/plugins/modules/request'

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
