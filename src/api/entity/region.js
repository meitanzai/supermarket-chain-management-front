import request from '@/utils/request'

export default {
  getRegionList() {
    return request({
      url: `/region/all`,
      method: 'get',
    })
  },
  deleteRegionById(id) {
    return request({
      url: `/region/${id}`,
      method: 'delete',
    })
  },
  saveRegion(regionEntity) {
    return request({
      url: `/region`,
      method: 'post',
      data: regionEntity
    })
  },
  updateRegionById(regionEntity) {
    return request({
      url: `/region/${regionEntity.id}`,
      method: 'put',
      data: regionEntity
    })
  },
  isExistRegionName(regionEntity) {
    return request({
      url: `/region/isExistRegionName`,
      method: 'post',
      data: regionEntity
    })
  }
}