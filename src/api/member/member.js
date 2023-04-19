import request from '@/utils/request'

export default {
  getMemberListPage(currentPage, size, memberQuery) {
    return request({
      url: `/member/${currentPage}/${size}`,
      method: 'post',
      data: memberQuery
    })
  },
  deleteMemberById(id) {
    return request({
      url: `/member/${id}`,
      method: 'delete'
    })
  },
  deleteBatchMember(ids) {
    return request({
      url: `/member/batch/${ids}`,
      method: 'delete'
    })
  },
  updateMemberById(memberEntity) {
    return request({
      url: `/member/${memberEntity.id}`,
      method: 'put',
      data: memberEntity
    })
  },
  saveMember(memberEntity) {
    return request({
      url: `/member`,
      method: 'post',
      data: memberEntity
    })
  },
  isExistMemberCardNumber(memberEntity) {
    return request({
      url: `/member/isExistMemberCardNumber`,
      method: 'post',
      data: memberEntity
    })
  },
  getMemberList() {
    return request({
      url: `/member/all`,
      method: 'get'
    })
  },
  getMemberNameById(id){
    return request({
      url: `/member/name/${id}`,
      method: 'get'
    })
  }
}