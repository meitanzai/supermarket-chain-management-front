import request from '@/utils/request'

export default {
  getBrandListPage(currentPage, size, brandQuery) {
    return request({
      url: `/brand/${currentPage}/${size}`,
      method: 'post',
      data: brandQuery
    })
  },
  updateBrandById(brandEntity) {
    return request({
      url: `/brand/${brandEntity.id}`,
      method: 'put',
      data: brandEntity
    })
  },
  saveBrand(brandEntity) {
    return request({
      url: `/brand`,
      method: 'post',
      data: brandEntity
    })
  },
  deleteBrandById(id) {
    return request({
      url: `/brand/${id}`,
      method: 'delete'
    })
  },
  deleteBatchBrand(ids) {
    return request({
      url: `/brand/batch/${ids}`,
      method: 'delete'
    })
  },
  getBrandList() {
    return request({
      url: `/brand/all`,
      method: 'get'
    })
  },
  isExistBrandName(brandEntity) {
    return request({
      url: `/brand/isExistBrandName`,
      method: 'post',
      data: brandEntity
    })
  }
}