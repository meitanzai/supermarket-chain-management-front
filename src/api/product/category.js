import request from '@/utils/request'

export default {

  getAllCategoryWithTree() {
    return request({
      url: `/category/allCategoryWithTree`,
      method: 'get',
    })
  },
  deleteCategoryById(id) {
    return request({
      url: `/category/${id}`,
      method: 'delete',
    })
  },
  saveCategory(category) {
    return request({
      url: `/category`,
      method: 'post',
      data: category
    })
  },
  updateCategoryById(category) {
    return request({
      url: `/category/${category.id}`,
      method: 'put',
      data: category
    })
  }
}
