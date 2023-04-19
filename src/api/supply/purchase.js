import request from '@/utils/request'

export default {
  getPurchaseListPage(currentPage, pageSize, purchaseQuery) {
    return request({
      url: `/purchase/${currentPage}/${pageSize}`,
      method: 'post',
      data: purchaseQuery
    })
  },
  deletePurchaseById(id) {
    return request({
      url: `/purchase/${id}`,
      method: 'delete'
    })
  },
  savePurchase(purchaseEntity) {
    return request({
      url: `/purchase`,
      method: 'post',
      data: purchaseEntity
    })
  },
  updatePurchase(purchaseEntity) {
    return request({
      url: `/purchase/${purchaseEntity.id}`,
      method: 'put',
      data: purchaseEntity
    })
  },
  getPurchaseDetails(purchaseId) {
    return request({
      url: `/purchase/${purchaseId}`,
      method: 'get'
    })
  },
  getSupplierIdBySupplierId(supplierId) {
    return request({
      url: `/purchase/supplierIdBySupplierId/${supplierId}`,
      method: 'get'
    })
  },
}