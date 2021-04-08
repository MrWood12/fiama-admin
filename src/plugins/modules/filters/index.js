import {
    formatMoney,
    formatLikeNum,
    formatString,
    formatDate,
    formatNickName,
    addImagePrefix,
    addGoodsImagePrefix
} from './filters.js'

const Filters = {
    install(Vue) {
        Vue.filter('formatMoney', formatMoney)
        Vue.filter('formatLikeNum', formatLikeNum)
        Vue.filter('formatString', formatString)
        Vue.filter('formatDate', formatDate)
        Vue.filter('formatNickName', formatNickName)
        Vue.filter('addImagePrefix', addImagePrefix)
        Vue.filter('addGoodsImagePrefix', addGoodsImagePrefix)
    }
}

export default Filters
