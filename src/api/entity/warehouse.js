import request from '@/utils/request'

export default {
  getWarehouseListPage(currentPage, size, warehouseQuery) {
    return request({
      url: `/warehouse/${currentPage}/${size}`,
      method: 'post',
      data: warehouseQuery
    })
  },
  getWarehouseRegionIdsByRegionId(regionId) {
    return request({
      url: `/warehouse/warehouseRegionIdsByRegionId/${regionId}`,
      method: 'get'
    })
  },
  deleteWarehouseById(id) {
    return request({
      url: `/warehouse/${id}`,
      method: 'delete'
    })
  },
  updateWarehouseById(warehouseEntity) {
    return request({
      url: `/warehouse/${warehouseEntity.id}`,
      method: 'put',
      data: warehouseEntity
    })
  },
  saveWarehouse(warehouseEntity) {
    return request({
      url: `/warehouse`,
      method: 'post',
      data: warehouseEntity
    })
  },
  getManagerIdByManagerId(managerId) {
    return request({
      url: `/warehouse/managerIdByManagerId/${managerId}`,
      method: 'get'
    })
  },
  isExistWarehouseRegion(warehouseEntity) {
    return request({
      url: `/warehouse/isExistWarehouseRegion`,
      method: 'post',
      data: warehouseEntity
    })
  },



  getWarehouseRegionList() {
    return request({
      url: `/warehouse/warehouseRegionList`,
      method: 'get'
    })
  },
  getWarehouseIdByRegionId(regionId) {
    return request({
      url: `/warehouse/warehouseIdByRegionId/${regionId}`,
      method: 'get'
    })
  },
  getRegionIdByWarehouseId(warehouseId) {
    return request({
      url: `/warehouse/regionIdByWarehouseId/${warehouseId}`,
      method: 'get'
    })
  },
  warehouseRegionAll() {
    return request({
      url: `/warehouse/warehouseRegionAll`,
      method: 'get'
    })
  }
}