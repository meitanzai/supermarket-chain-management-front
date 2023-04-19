import request from '@/utils/request'

export default {
  getInstockListPage(currentPage, pageSize, instockQuery) {
    return request({
      url: `/instock/${currentPage}/${pageSize}`,
      method: 'post',
      data: instockQuery
    })
  },
  getWarehouseIdByRegionId(regionId) {
    return request({
      url: `/instock/warehouseIdByRegionId/${regionId}`,
      method: 'get'
    })
  },
  deleteInstockById(id) {
    return request({
      url: `/instock/${id}`,
      method: 'delete'
    })
  },
  updateInstock(instockEntity) {
    return request({
      url: `/instock/${instockEntity.id}`,
      method: 'put',
      data: instockEntity
    })
  },
  saveInstock(instockEntity) {
    return request({
      url: `/instock`,
      method: 'post',
      data: instockEntity
    })
  },
  getInstockRegionIds(warehouseId) {
    return request({
      url: `/instock/instockRegionIds/${warehouseId}`,
      method: 'get'
    })
  },
}