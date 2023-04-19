import request from '@/utils/request'

export default {
  getUserListPage(currentPage, pageSize, userEntity) {
    return request({
      url: `/user/${currentPage}/${pageSize}`,
      method: 'post',
      data: userEntity
    })
  },
  deleteBatchUser(ids) {
    return request({
      url: `/user/batch/${ids}`,
      method: 'delete'
    })
  },
  deleteUserById(id) {
    return request({
      url: `/user/${id}`,
      method: 'delete'
    })
  },
  updateUserById(userEntity, roleIds) {
    return request({
      url: `/user/${userEntity.id}/${roleIds}`,
      method: 'put',
      data: userEntity
    })
  },
  saveUser(userEntity, roleIds) {
    return request({
      url: `/user/${roleIds}`,
      method: 'post',
      data: userEntity
    })
  },
  isExistUserName(userEntity) {
    return request({
      url: `/user/isExistUserName`,
      method: 'post',
      data: userEntity
    })
  },
}