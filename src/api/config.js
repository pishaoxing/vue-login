import axios from 'axios'
import router from '../router'
import ElementUI from "element-ui"
// 通过axios.create方法 配置默认请求属性
// const baseURL = process.env.NODE_ENV === 'development' ? '/api' : 'http://chst.vip:1901'
let baseURL;
let env = process.env.NODE_ENV
switch (env) {
  case "development":
    baseURL = '/api'
    break;
  case "production":
    baseURL = 'http://chst.vip'
    break
  case "test":
    baseURL = 'xxx'
}
axios.defaults.baseURL = baseURL
axios.create({
  timeout: 3000,
  withCredentials: true// 开启携带认证
})

// 编写拦截器

// 请求拦截器 给每个请求都添加上headers['authorzation']
axios.interceptors.request.use(config => {
  // 判断请求路径 如果请求的是登入接口或者注册接口 那么直接放行
  if (config.url === '/users/login' || config.url === '/users/regist') {
    return config
  }
  const token = localStorage.getItem('wf-token')
  config.headers.authorization = token
  return config // 相当于给请求放行
})

// let path = router.history.current.path;//获取

// 响应拦截器

axios.interceptors.response.use(config => {
  const { data } = config
  if (data) {
    // 如果后台返回1004状态码 则表示校验失败 返回10022表示后台登入态失效 页面需要跳转到登入页
    if (data.code === '1004' || data.code === '10022') {
      ElementUI.Message.error('登入过期')
      localStorage.removeItem('wf-token')
      router.push('/login')
    } else {
      // 放行
      return config
    }
  } else { // 请求出现错误
    alert('请求出错')
  }
})

export default axios
