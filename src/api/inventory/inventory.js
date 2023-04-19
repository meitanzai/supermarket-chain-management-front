import request from '@/utils/request'

export default {
  getInventoryListPage(currentPage, pageSize, InventoryQuery) {
    return request({
      url: `/inventory/${currentPage}/${pageSize}`,
      method: 'post',
      data: InventoryQuery
    })
  },
  getWarehouseIdByRegionId(regionId) {
    return request({
      url: `/inventory/getWarehouseIdByRegionId/${regionId}`,
      method: 'get'
    })
  }
}