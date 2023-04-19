import request from '@/utils/request'

export default {
  getPermissionListPage(permissionQuery) {
    return request({
      url: `/permission`,
      method: 'post',
      data: permissionQuery
    })
  },
  getPermissionList() {
    return request({
      url: `/permission/all`,
      method: 'get'
    })
  }
}