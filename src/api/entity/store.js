import request from '@/utils/request'

export default {
  // 获取门店列表
  getStoreListPage(currentPage, size, storeQuery) {
    return request({
      url: `/store/${currentPage}/${size}`,
      method: 'post',
      data: storeQuery
    })
  },
  deleteBatchStore(ids) {
    return request({
      url: `/store/batch/${ids}`,
      method: 'delete'
    })
  },
  deleteStoreById(id) {
    return request({
      url: `/store/${id}`,
      method: 'delete'
    })
  },
  getStoreRegionIdsByRegionId(regionId) {
    return request({
      url: `/store/storeRegionIdsByRegionId/${regionId}`,
      method: 'get'
    })
  },
  updateStoreById(storeEntity) {
    return request({
      url: `/store/${storeEntity.id}`,
      method: 'put',
      data: storeEntity
    })
  },
  saveStore(storeEntity) {
    return request({
      url: `/store`,
      method: 'post',
      data: storeEntity
    })
  },
  isExistStoreRegion(storeEntity) {
    return request({
      url: `/store/isExistStoreRegion`,
      method: 'post',
      data: storeEntity
    })
  },
  getManagerIdByManagerId(managerId) {
    return request({
      url: `/store/managerIdByManagerId/${managerId}`,
      method: 'get'
    })
  },


  getStoreRegionList() {
    return request({
      url: `/store/storeRegionList`,
      method: 'get'
    })
  },
  getStoreIdByRegionId(regionId) {
    return request({
      url: `/store/storeIdByRegionId/${regionId}`,
      method: 'get'
    })
  },
  getRegionIdByStoreId(storeId) {
    return request({
      url: `/store/regionIdByStoreId/${storeId}`,
      method: 'get'
    })
  }
}