import request from '@/utils/request'

export default {
  getProductListPage(currentPage, limit, productQuery) {
    return request({
      url: `/product/${currentPage}/${limit}`,
      method: 'post',
      data: productQuery
    })
  },
  getProductList() {
    return request({
      url: `/product/all`,
      method: 'get'
    })
  },
  updateProductById(productEntity) {
    return request({
      url: `/product/${productEntity.id}`,
      method: 'put',
      data: productEntity
    })
  },
  deleteBatchProduct(ids) {
    return request({
      url: `/product/batch/${ids}`,
      method: 'delete'
    })
  },
  deleteProductById(id) {
    return request({
      url: `/product/${id}`,
      method: 'delete'
    })
  },
  saveProduct(productEntity) {
    return request({
      url: `/product`,
      method: 'post',
      data: productEntity
    })
  },
  getCategoryIdsByCategoryId(categoryId) {
    return request({
      url: `/product/categoryIdsByCategoryId/${categoryId}`,
      method: 'get'
    })
  },
  getBrandIdByBrandId(brandId) {
    return request({
      url: `/product/brandIdByBrandId/${brandId}`,
      method: 'get'
    })
  },
  isExistProductName(productEntity) {
    return request({
      url: `/product/isExistProductName`,
      method: 'post',
      data: productEntity
    })
  },

  getProductListByBrandIdAndCategoryId(brandId, categoryId) {
    return request({
      url: `/product/brandId/${brandId}/categoryId/${categoryId}`,
      method: 'get'
    })
  },
  getProductIdById(id) {
    return request({
      url: `/product/${id}`,
      method: 'get'
    })
  },
  getBrandIdById(id) {
    return request({
      url: `/product/brandId/${id}`,
      method: 'get'
    })
  },
  getCategoryIdById(id) {
    return request({
      url: `/product/categoryId/${id}`,
      method: 'get'
    })
  },
  updatePromotionalPriceById(id, promotionalPrice) {
    return request({
      url: `/product/promotionalPrice/${id}/${promotionalPrice}`,
      method: 'put'
    })
  }
}