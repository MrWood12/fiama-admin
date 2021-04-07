import { get, put } from '@/plugins/modules/request'

export const getServiceList = params => get('/service/all-order-list', params)

export const approve = params => put('/service/approve', params)

export const reject = params => put('/service/reject', params)
