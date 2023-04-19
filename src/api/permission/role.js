import request from '@/utils/request'

export default {
  getRoleListPage(currentPage, pageSize, roleEntity) {
    return request({
      url: `/role/${currentPage}/${pageSize}`,
      method: 'post',
      data: roleEntity
    })
  },
  deleteBatchRole(ids) {
    return request({
      url: `/role/batch/${ids}`,
      method: 'delete'
    })
  },
  deleteRoleById(id) {
    return request({
      url: `/role/${id}`,
      method: 'delete'
    })
  },
  updateRoleById(roleEntity, permissionIds) {
    return request({
      url: `/role/${roleEntity.id}/${permissionIds}`,
      method: 'put',
      data: roleEntity
    })
  },
  saveRole(roleEntity, permissionIds) {
    return request({
      url: `/role/${permissionIds}`,
      method: 'post',
      data: roleEntity
    })
  },
  isExistRoleName(roleEntity) {
    return request({
      url: `/role/isExistRoleName`,
      method: 'post',
      data: roleEntity
    })
  },
  getRoleList() {
    return request({
      url: `/role/all`,
      method: 'get'
    })
  }
}