import axios from './config'
// 登入
export const login = (username, password) => axios({
  url: '/users/login',
  method: 'post',
  data: {
    username,
    password
  }
})

// 获取登入日志
export const getLoginLog = () => axios.get('/getloginlog')

// 获取用户菜单
export const getMenuList = () => axios.get('/permission/getMenuList')

// 获取学员信息
export const getStuList = (params = {}) => {
  console.log(params)
  return axios({
    url: '/students/getstulist',
    params
  })
}
// 增加学员信息
export const addStuDetail = (stuDetail) => axios({
  url: '/students/addstu',
  method: 'post',
  data: stuDetail
})
// 删除学员
export const delStu = (sId) => axios.get(`/students/delstu?sId=${sId}`)
// 编辑学员信息
export const updateStu = (updated = {}) => axios({
  url: '/students/updatestu',
  method: 'post',
  data: updated
})
// 搜索学员
export const searchStu = (params) => {
  return axios(
    {
      url: '/students/searchstu',
      params
    }
  )
}

// 获取班级 /students/getclasses
export const getClasses = () => axios.get('/students/getclasses')

// 微信登入 /users/wechatLogin
export const wechatLogin = (wechatCode) => axios.get(`/users/wechatLogin?wechatCode=${wechatCode}`)
