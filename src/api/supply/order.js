import request from '@/utils/request'

export default {
  getPurchaseOrderListPage(currentPage, pageSize, purchaseOrderQuery) {
    return request({
      url: `/purchaseOrder/${currentPage}/${pageSize}`,
      method: 'post',
      data: purchaseOrderQuery
    })
  },
  updatePurchaseOrder(purchaseOrderEntity) {
    return request({
      url: `/purchaseOrder/${purchaseOrderEntity.id}`,
      method: 'put',
      data: purchaseOrderEntity
    })
  },
  getIsPayByPurchaseId(purchaseId) {
    return request({
      url: `/purchaseOrder/isPay/${purchaseId}`,
      method: 'get'
    })
  },
  getPurchaseDetails(purchaseId) {
    return request({
      url: `/purchaseOrder/${purchaseId}`,
      method: 'get'
    })
  },
  getOrders(){
    return request({
      url: `/purchaseOrder`,
      method: 'get'
    })
  }
}