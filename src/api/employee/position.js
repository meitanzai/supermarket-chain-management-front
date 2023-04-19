import request from '@/utils/request'

export default {
  getPositionListPage(currentPage, size, positionQuery) {
    return request({
      url: `/position/${currentPage}/${size}`,
      method: 'post',
      data: positionQuery
    })
  },
  deletePositionById(id) {
    return request({
      url: `/position/${id}`,
      method: 'delete'
    })
  },
  updatePosition(positionEntity) {
    return request({
      url: `/position/${positionEntity.id}`,
      method: 'put',
      data: positionEntity
    })
  },
  savePosition(positionEntity) {
    return request({
      url: `/position`,
      method: 'post',
      data: positionEntity
    })
  },
  deleteBatchPosition(ids) {
    return request({
      url: `/position/batch/${ids}`,
      method: 'delete'
    })
  },
  getPositionList() {
    return request({
      url: `/position/all`,
      method: 'get'
    })
  },
  isExistPositionName(positionEntity) {
    return request({
      url: `/position/isExistPositionName`,
      method: 'post',
      data: positionEntity
    })
  },
  getPositionIdById(positionId) {
    return request({
      url: `/position/${positionId}`,
      method: 'get'
    })
  }
}