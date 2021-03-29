import { get, post } from '@/plugins/modules/request'

export const applyList = () => get('pet-list/apply-list')

export const audit = params => post('pet-list/audit', params)
