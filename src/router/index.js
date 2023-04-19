import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  // {
  //   path: '/404',
  //   component: () => import('@/views/404'),
  //   hidden: true
  // },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '连锁超市后台首页', icon: 'dashboard' }
    }]
  },
  // {
  //   path: '/statistics',
  //   component: Layout,
  //   redirect: '/statistics/price_comparison/table',
  //   name: '统计分析模块',
  //   meta: { title: '统计分析模块', icon: 'el-icon-s-help' },
  //   children: [
  //     {
  //       path: 'price_comparison/table',
  //       name: '商品进价变化',
  //       component: () => import('@/views/statistics/price_comparison/index'),
  //       meta: { title: '商品进价变化', icon: 'table' }
  //     },
  //     {
  //       path: 'supplier_price_change/table',
  //       name: '供货商价格对比',
  //       component: () => import('@/views/statistics/supplier_price_change/index'),
  //       meta: { title: '供货商价格对比', icon: 'table' }
  //     },
  //     {
  //       path: 'proportion_of_expenditure/table',
  //       name: '上月支出占比',
  //       component: () => import('@/views/statistics/proportion_of_expenditure/index'),
  //       meta: { title: '上月支出占比', icon: 'table' }
  //     },
  //     {
  //       path: 'shelflife_promotion/table',
  //       name: '保质期与促销',
  //       component: () => import('@/views/statistics/shelflife_promotion/index'),
  //       meta: { title: '保质期与促销', icon: 'table' }
  //     },
      // {
      //   path: 'order/table',
      //   name: '订单管理',
      //   component: () => import('@/views/supply/order/index'),
      //   meta: { title: '订单管理', icon: 'table' }
      // },
      // {
      //   path: 'purchase/table',
      //   name: '进货管理',
      //   component: () => import('@/views/supply/purchase/index'),
      //   meta: { title: '进货管理', icon: 'table' }
      // },
    ]
  // {
  //   path: '/permission',
  //   component: Layout,
  //   redirect: '/permission/permission/table',
  //   name: '权限模块',
  //   meta: { title: '权限模块', icon: 'el-icon-s-help' },
  //   children: [
  //     {
  //       path: 'user/table',
  //       name: '用户管理',
  //       component: () => import('@/views/permission/user/index'),
  //       meta: { title: '用户管理', icon: 'table' }
  //     },
  //     {
  //       path: 'role/table',
  //       name: '角色管理',
  //       component: () => import('@/views/permission/role/index'),
  //       meta: { title: '角色管理', icon: 'table' }
  //     },
  //     {
  //       path: 'permission/table',
  //       name: '权限管理',
  //       component: () => import('@/views/permission/permission/index'),
  //       meta: { title: '权限管理', icon: 'table' }
  //     },
  //   ]
  // },
  // {
  //   path: '/product',
  //   component: Layout,
  //   redirect: '/product/category/tree',
  //   name: '商品模块',
  //   meta: { title: '商品模块', icon: 'el-icon-s-help' },
  //   children: [
  //     {
  //       path: 'category/tree',
  //       name: '分类管理',
  //       component: () => import('@/views/product/category/index'),
  //       meta: { title: '分类管理', icon: 'tree' }
  //     },
  //     {
  //       path: 'brand/table',
  //       name: '品牌管理',
  //       component: () => import('@/views/product/brand/index'),
  //       meta: { title: '品牌管理', icon: 'table' }
  //     },
  //     {
  //       path: 'product/table',
  //       name: '商品管理',
  //       component: () => import('@/views/product/product/index'),
  //       meta: { title: '商品管理', icon: 'table' }
  //     }
  //   ]
  // },
  // {
  //   path: '/entity',
  //   component: Layout,
  //   redirect: '/entity/region/table',
  //   name: '实体模块',
  //   meta: { title: '实体模块', icon: 'el-icon-s-help' },
  //   children: [
  //     {
  //       path: 'region/table',
  //       name: '地区管理',
  //       component: () => import('@/views/entity/region/index'),
  //       meta: { title: '地区管理', icon: 'table' }
  //     },
  //     {
  //       path: 'store/table',
  //       name: '超市门店管理',
  //       component: () => import('@/views/entity/store/index'),
  //       meta: { title: '超市门店管理', icon: 'table' }
  //     },
  //     {
  //       path: 'warehouse/table',
  //       name: '仓库管理',
  //       component: () => import('@/views/entity/warehouse/index'),
  //       meta: { title: '仓库管理', icon: 'table' }
  //     },
  //   ]
  // },
  // {
  //   path: '/member',
  //   component: Layout,
  //   redirect: '/member/member/table',
  //   name: '会员模块',
  //   meta: { title: '会员模块', icon: 'el-icon-s-help' },
  //   children: [
  //     {
  //       path: 'member/table',
  //       name: '会员管理',
  //       component: () => import('@/views/member/member/index'),
  //       meta: { title: '会员管理', icon: 'table' }
  //     },
  //     {
  //       path: 'memberpoint/table',
  //       name: '会员积分管理',
  //       component: () => import('@/views/member/memberpoint/index'),
  //       meta: { title: '会员积分管理', icon: 'table' }
  //     },
  //   ]
  // },
  // {
  //   path: '/employee',
  //   component: Layout,
  //   redirect: '/employee/employee/table',
  //   name: '员工模块',
  //   meta: { title: '员工模块', icon: 'el-icon-s-help' },
  //   children: [
  //     {
  //       path: 'employee/table',
  //       name: '员工管理',
  //       component: () => import('@/views/employee/employee/index'),
  //       meta: { title: '员工管理', icon: 'table' }
  //     },
  //     {
  //       path: 'position/table',
  //       name: '职位管理',
  //       component: () => import('@/views/employee/position/index'),
  //       meta: { title: '职位管理', icon: 'table' }
  //     },
  //   ]
  // },
  // {
  //   path: '/supply',
  //   component: Layout,
  //   redirect: '/supply/supply/table',
  //   name: '供应模块',
  //   meta: { title: '供应模块', icon: 'el-icon-s-help' },
  //   children: [
  //     {
  //       path: 'supply/table',
  //       name: '供应商管理',
  //       component: () => import('@/views/supply/supply/index'),
  //       meta: { title: '供应商管理', icon: 'table' }
  //     },
  //     {
  //       path: 'order/table',
  //       name: '订单管理',
  //       component: () => import('@/views/supply/order/index'),
  //       meta: { title: '订单管理', icon: 'table' }
  //     },
  //     {
  //       path: 'purchase/table',
  //       name: '进货管理',
  //       component: () => import('@/views/supply/purchase/index'),
  //       meta: { title: '进货管理', icon: 'table' }
  //     },
  //   ]
  // },
  // {
  //   path: '/inventory',
  //   component: Layout,
  //   redirect: '/inventory/inventory/table',
  //   name: '库存模块',
  //   meta: { title: '库存模块', icon: 'el-icon-s-help' },
  //   children: [
  //     {
  //       path: 'inventory/table',
  //       name: '库存管理',
  //       component: () => import('@/views/inventory/inventory/index'),
  //       meta: { title: '库存管理', icon: 'table' }
  //     },
  //     {
  //       path: 'instock/table',
  //       name: '进库管理',
  //       component: () => import('@/views/inventory/instock/index'),
  //       meta: { title: '进库管理', icon: 'table' }
  //     },
  //     {
  //       path: 'outstock/table',
  //       name: '出库管理',
  //       component: () => import('@/views/inventory/outstock/index'),
  //       meta: { title: '出库管理', icon: 'table' }
  //     },
  //   ]
  // },

  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }


const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
