import request from '@/utils/request'

export default {
  getMemberPointListPageByMemberId(currentPage, size, memberPointQuery, memberId) {
    return request({
      url: `/memberPoint/getMemberPointListPage/${currentPage}/${size}/${memberId}`,
      method: 'post',
      data: memberPointQuery
    })
  },
  getMemberPointListPage(currentPage, size, memberPointQuery) {
    return request({
      url: `/memberPoint/getMemberPointListPage/${currentPage}/${size}`,
      method: 'post',
      data: memberPointQuery
    })
  },
  deleteBatchMemberPoint(ids) {
    return request({
      url: `/memberPoint/batch/${ids}`,
      method: 'delete'
    })
  },
  deleteMemberPointById(id) {
    return request({
      url: `/memberPoint/${id}`,
      method: 'delete'
    })
  },
  updateMemberPointById(memberPointEntity) {
    return request({
      url: `/memberPoint/${memberPointEntity.id}`,
      method: 'put',
      data: memberPointEntity
    })
  },
  saveMemberPoint(memberPointEntity) {
    return request({
      url: `/memberPoint`,
      method: 'post',
      data: memberPointEntity
    })
  }
}