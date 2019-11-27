import Axios from 'axios'
import Qs from 'qs'
import $bus from '@/utils/bus'

const config = {
  timeout: 5000,
  baseURL: 'localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
}

const createError = response => {
  if (!response) {
    $bus.$emit('createError', response)
    return
  }
  let status = response.status
  if (status === 200) {
    return
  } else if (status === 404) {
    response.statusText = '资源不存在'
  } else if (status >= 500) {
    response.statusText = '服务器内部错误'
  }
  $bus.$emit('createError', response)
}

const source = Axios.CancelToken.source()
const $http = Axios.create(config)
$http.interceptors.request.use(
  config => {
    // 判断token
    config.data = Qs.stringify(config.data) // 序列化
    config.params = JSON.stringify(config.params)
    config.headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    return config
  },
  error => {
    console.log('axios error message:', error) // eslint-disable-line
  }
)
try {
  $http.interceptors.response.use(
    response => {
      createError(response)
      return response
    },
    error => {
      console.log(error)
      if (!error.response) {
        source.cancel('不再请求')
      }
      createError(error.response)
    }
  )
} catch (error){
  console.log(error)
}
export function Post(url, params) {
  return $http.post(url, params)
}
export function Get(url, params) {
  return $http.get(url, {
    params: {
      query: Qs.stringify(params)
    }
  })
}
export function GetOne(url, id) {
  return $http.get(`${url}/${id}`)
}

export class PublicAPI {
  // #request = null // 预留方案
  constructor(baseUrl, option) {
    this.baseUrl = baseUrl
    this.option = option
    this.request = Axios.create({
      ...config,
      baseURL: baseUrl || config.baseURL,
      ...option
    })
  }
  // 创建request对象，但是需要的是私有化（预留）

  // 设置 baseUrl 和 option
  setRequest(baseURL, option) {
    this.baseUrl = baseURL
    this.option = option
  }
  // get 请求
  fetch(url, params) {
    return this.request.get(url, { params })
  }
  // post 请求
  post(url, params) {
    for (let key in params) {
      if (params.hasOwnProperty(key) && typeof params[key] === 'number') {
        params[key] = params[key].toString()
      }
    }
    return this.request.post(url, JSON.stringify(params))
  }
}
export default PublicAPI
