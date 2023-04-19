import request from '@/utils/request'

export default {
  getPriceComparison(product) {
    return request({
      url: '/statistics/priceComparison',
      method: 'post',
      data: product
    })
  },
  getSupplierPriceChange(product) {
    return request({
      url: '/statistics/supplierPriceChange',
      method: 'post',
      data: product
    })
  },
  getMemberRegister() {
    return request({
      url: '/statistics/memberRegister',
      method: 'get',
    })
  },
  getOrders() {
    return request({
      url: '/statistics/orders',
      method: 'get',
    })
  },
  getIncome() {
    return request({
      url: '/statistics/income',
      method: 'get',
    })
  },
  getExpendse() {
    return request({
      url: '/statistics/expendse',
      method: 'get',
    })
  },
  getIncomeAndExpendse() {
    return request({
      url: '/statistics/incomeAndExpendse',
      method: 'get',
    })
  },
  getDailySales() {
    return request({
      url: '/statistics/dailySales',
      method: 'get',
    })
  },
  getProportionOfExpenditure() {
    return request({
      url: '/statistics/proportionOfExpenditure',
      method: 'get',
    })
  },
  getShelflife(query) {
    return request({
      url: '/statistics/shelflife',
      method: 'post',
      data: query
    })
  },
  userBrowse(userId, type) {
    return request({
      url: `/statistics/userBrowse/${userId}/${type}`,
      method: 'get',
    })
  },
  getNewOrderNoticeNum(userId) {
    return request({
      url: `/statistics/newOrderNoticeNum/${userId}`,
      method: 'get',
    })
  },
  getNewShelfLifeNoticeNum(userId) {
    return request({
      url: `/statistics/newShelfLifeNoticeNum/${userId}`,
      method: 'get',
    })
  },
  getNewInventoryCountNoticeNum(userId) {
    return request({
      url: `/statistics/newInventoryCountNoticeNum/${userId}`,
      method: 'get',
    })
  }
}