import request from '@/utils/request'

export default {
  getOutstockListPage(currentPage,size,outstockQuery) {
    return request({
      url: `/outstock/${currentPage}/${size}`,
      method: 'post',
      data: outstockQuery
    })
  },
  getWarehouseIdByRegionId(regionId) {
    return request({
      url: `/outstock/warehouseIdByRegionId/${regionId}`,
      method: 'get'
    })
  },
  deleteOutstockById(id) {
    return request({
      url: `/outstock/${id}`,
      method: 'delete'
    })
  },
  updateOutstock(outstockEntity) {
    return request({
      url: `/outstock/${outstockEntity.id}`,
      method: 'put',
      data: outstockEntity
    })
  },
  saveOutstock(outstockEntity) {
    return request({
      url: `/outstock`,
      method: 'post',
      data: outstockEntity
    })
  },
  getOutstockRegionIds(warehouseId) {
    return request({
      url: `/outstock/outstockRegionIds/${warehouseId}`,
      method: 'get'
    })
  },
}