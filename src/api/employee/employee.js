import request from '@/utils/request'

export default {
  getEmployeeListPageByPositionId(currentPage, size, employeeQuery, positionId) {
    return request({
      url: `/employee/employeeListPageByPositionId/${currentPage}/${size}/${positionId}`,
      method: 'post',
      data: employeeQuery
    })
  },
  getEmployeeListPageByStoreId(currentPage, size, employeeQuery, storeId) {
    return request({
      url: `/employee/employeeListPageByStoreId/${currentPage}/${size}/${storeId}`,
      method: 'post',
      data: employeeQuery
    })
  },
  getEmployeeListPageByWarehouseId(currentPage, size, employeeQuery, warehouseId) {
    return request({
      url: `/employee/employeeListPageByWarehouseId/${currentPage}/${size}/${warehouseId}`,
      method: 'post',
      data: employeeQuery
    })
  },
  getStoreManagerList() {
    return request({
      url: `/employee/storeManagerList`,
      method: 'get'
    })
  },
  getWarehouseManagerList() {
    return request({
      url: `/employee/warehouseManagerList`,
      method: 'get'
    })
  },
  getEmployeeListPage(currentPage, size, employeeQuery) {
    return request({
      url: `/employee/${currentPage}/${size}`,
      method: 'post',
      data: employeeQuery
    })
  },
  deleteBatchEmployee(ids) {
    return request({
      url: `/employee/batch/${ids}`,
      method: 'delete'
    })
  },
  deleteEmployeeById(id) {
    return request({
      url: `/employee/${id}`,
      method: 'delete'
    })
  },
  updateEmployeeById(employeeEntity) {
    return request({
      url: `/employee/${employeeEntity.id}`,
      method: 'put',
      data: employeeEntity
    })
  },
  saveEmployee(employeeEntity) {
    return request({
      url: `/employee`,
      method: 'post',
      data: employeeEntity
    })
  },
  isExistWorkNumber(employeeEntity) {
    return request({
      url: `/employee/isExistWorkNumber`,
      method: 'post',
      data: employeeEntity
    })
  }
}