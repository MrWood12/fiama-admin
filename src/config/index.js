module.exports = {
  // 服务器根路径
  BASE_URL: process.env.VUE_APP_SERVER_URL,
  // 图片服务器路径
  IMAGE_BASE_URL: process.env.VUE_APP_IMG_SERVER_URL,
  GOODS_IMAGE_URL: process.env.VUE_APP_IMG_SERVER_URL + 'goods-url/',
  // 成功的状态码
  SUCCESS_CODE: 10000,
  // 未知错误
  FAIL_CODE: 40999,
  // 参数不合法
  INVALID_PARAM_CODE: 40099,
  // 请求参数不能为空
  EMPTY_PARAM_CODE: 40009,
  // 请求超时时间
  TIMEOUT: 10 * 1000
}
