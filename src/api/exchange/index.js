import { get, post } from '@/plugins/modules/request'

export const applyList = () => get('exchange/applying-list')

export const approved = params => post('exchange/approved', params)
