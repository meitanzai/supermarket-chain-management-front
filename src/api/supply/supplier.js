import request from '@/utils/request'

export default {
  getSupplierListPage(currentPage, pageSize, supplierQuery) {
    return request({
      url: `/supplier/${currentPage}/${pageSize}`,
      method: 'post',
      data: supplierQuery
    })
  },
  deleteBatchSupplier(ids) {
    return request({
      url: `/supplier/batch/${ids}`,
      method: 'delete'
    })
  },
  getSupplierRegionIdsByRegionId(regionId) {
    return request({
      url: `/supplier/supplierRegionIdsByRegionId/${regionId}`,
      method: 'get'
    })
  },
  deleteSupplierById(id) {
    return request({
      url: `/supplier/${id}`,
      method: 'delete'
    })
  },
  saveSupplier(supplierEntity) {
    return request({
      url: `/supplier`,
      method: 'post',
      data: supplierEntity
    })
  },
  updateSupplierById(supplierEntity) {
    return request({
      url: `/supplier/${supplierEntity.id}`,
      method: 'put',
      data: supplierEntity
    })
  },
  getSupplierList() {
    return request({
      url: `/supplier/all`,
      method: 'get'
    })
  },
  isExistSupplierNameAndRegion(supplierEntity) {
    return request({
      url: `/supplier/isExistSupplierNameAndRegion`,
      method: 'post',
      data: supplierEntity
    })
  }
}