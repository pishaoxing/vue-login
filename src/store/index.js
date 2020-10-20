import Vue from 'vue'
import Vuex from 'vuex'
import { getMenuList } from '@/api'
import DynamicRoutes from '@/router/DynamicRoutes' // 动态路由
import router from '@/router' // 引入路由
// 引入recursionRoutes递归函数 处理用户路由
import recursionRoutes from '../uitils/recursionRoutes'
// 引入allRoutes
import allRoutes from '../router/allRoutes'
Vue.use(Vuex)

let userInfo = JSON.parse(localStorage.getItem('wf-userInfo')) || {};
let permissionButtons = JSON.parse(localStorage.getItem('wf-permission-buttons')) || {};

export default new Vuex.Store({
  state: {
    sideMenu: [],
    userInfo,
    permissionButtons,
    crumb: []
  },
  mutations: {
    SET_SIDEMENU(state, payload) { // 设置用户菜单
      state.sideMenu = payload
      // 找到"/"路径的路由 因为所有的路由页面都是它的children
      const target = DynamicRoutes.find(item => item.path === '/')
      target.children = [...state.sideMenu]
      router.addRoutes(DynamicRoutes)
    },
    CLEAR_SIDEMENU(state) {
      state.sideMenu = []
    },
    SET_USERINFO(state, payload) {
      state.userInfo = payload
    },
    SET_PERMISSION_BUTTONS(state, payload) {
      state.permissionButtons = payload
    },
    //设置面包屑的值
    SET_CRUMB(state, payload) {
      state.crumb = payload
    }
  },
  actions: {
    async FETCH_MENULIST({ commit }) { // 获取用户菜单
      // 发起异步请求 获取用户菜单
      const res = await getMenuList()
      if (res && res.data) { // 得到结果了
        // 递归获取用户路由
        const userMenu = recursionRoutes(allRoutes, res.data.menuList)
        commit('SET_SIDEMENU', userMenu)
      }
    }
  },
  modules: {
  }
})
