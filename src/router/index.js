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
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '宠物商店', icon: 'dashboard' }
    }]
  },
  {
    path: '/example',
    component: Layout,
    redirect: '/example/tool',
    name: 'Example',
    meta: { title: '商品列表', icon: 'el-icon-coin' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/tool/index'),
        meta: { title: '工具列表', icon: 'el-icon-coin' }
      },
      {
        path: 'petList',
        name: 'PetList',
        component: () => import('@/views/pet-list/index'),
        meta: { title: '宠物列表', icon: 'el-icon-coin' }
      }
    ]
  },
  {
    path: '/form',
    component: Layout,
    meta: { title: '订单列表', icon: 'el-icon-menu' },
    children: [
      {
        path: 'index',
        name: 'Order',
        component: () => import('@/views/order-list/index'),
        meta: { title: '商品订单', icon: 'el-icon-s-order' }
      },
      {
        path: 'service',
        name: 'Service',
        component: () => import('@/views/service-list/index'),
        meta: { title: '服务订单', icon: 'el-icon-s-platform' }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'User',
        component: () => import('@/views/user-list/index'),
        meta: { title: '用户管理', icon: 'el-icon-user-solid' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
  // routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

// router.addRoutes()
console.log(router)
export default router
