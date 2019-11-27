## Axios封装基本的增删改查
<p align="center">
   <a href="https://github.com/smallMote">
    <img src="https://img.shields.io/badge/author-Luck%20Yang-green" alt="Luck Yang wlittleyang webneo">
  </a>
   <a href="https://github.com/smallMote/axios-crud">
    <img src="https://img.shields.io/badge/version-0.1.0-green" alt="Luck Yang wlittleyang webneo">
  </a>
   <a href="https://me.csdn.net/Mote123">
    <img src="https://img.shields.io/badge/CSDN-Luck%20Yang-orange" alt="Luck Yang wlittleyang webneo">
  </a>
</p>

> api.js

使用 api.js 做第一层封装，这一层可以提供最基本的 get、post方法，
以及 axios 拦截和错误处理，在请求拦截主要对 data 做了序列化（get 
请求的参数），对 params 做了字符串处理（post 请求对参数）。其中对
错误处理采用对是订阅模式，无论是在 react 还是 vue 中都是可用的，若
不再这些环境中也可以直接拿掉自行处理。在返回拦截中对404和大于等于500
对状态吗进行了拦截处理，401-499可以自定义错误，直接抛出自行处理。

其中该文件已经直接导出 Post、GeT、GetOne 方法，默认导出的是 PublicAPI 
类。GetOne 方法主要针对于使用 /url/id 这种模式。

PublicAPI 类，可提供自定义配置，在构造对象的时候可以传递 baseUrl 
和 option 配置，其中包含了 fetch（axios 的 get 方法） 和 post 方
法，post 方法中对数字也做了字符串格式化，若不需要也可以去掉 post 方法
中这段代码
```javascript
for (let key in params) {
  if (params.hasOwnProperty(key) && typeof params[key] === 'number') {
    params[key] = params[key].toString()
  }
}
```

> crud.js

该文件仅包含了 CrudAPI 类，用于增删改查，该类继承了 PublicAPI 类来实
现接口对请求。在构造该对象对时候支持传递一个 baseUrl ，这个参数是建立在
PublicAPI 类之上对，举个列子
```javascript
import PublicAPI from 'PublicAPI'
import CrudAPI from 'CrudAPI'
const publicAPI = new PublicAPI('https://baseUrl')
const crudAPI = new CrudAPI('/baseUrl')

console.log(publicAPI.baseUrl) // https://baseUrl
console.log(crudAPI.baseUrl) // https://baseUrl/baseUrl
```
这样做对目的很简单，因为往往我们得到对 api 接口对一个通用数据对增删该查接
口往往是不会改变的，自然增删该查的函数也是支持直接传递 url 的，与 PublicAPI 
中的方法使用无一。

CrudAPI 类中包含了添加数据、自定义条件删除、id 删除、自定义条件更新数据、id 
更新数据、查询所有、条件查询。在这些函数中都是支持传递一个和全参，当传递参数为
一个的时候且不属于 url 类型时，默认赋值给了第二参数，而 url 使用的是构造对象
时候的 baseUrl。

> 使用

创建 CrudAPI 这个对象之后我们可以直接调用其中的方法也可以继承直接使用或者重载
。例如：
```javascript
// 使用构造对象的方式
import CrudAPI from 'CrudAPI'
const crudAPI = new CrudAPI('/user')
crudAPI.fetchAll()
crudAPI.fetchListByFilter()
crudAPI.update({ name: 'Luck Yang'})
crudAPI.update('/user', { name: 'Luck Yang'})
...
```

```javascript
// 继承方式
import CrudAPI from 'CrudAPI'
class User extends CrudAPI {
  super('/user')
  
  fetchAllUser() {
    return super.fetchAll()
  }
  ...
}
```

[源码下载](http://q1me9gg3u.bkt.clouddn.com/axios-crud.zip)


###### 源码展示

> api.js
```javascript
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
```

> crud.js

```javascript
import PublicAPI from './api'
// 基本的增删该查封装
export default class CrudAPI extends PublicAPI {
  constructor(baseUrl, crudUrl) {
    // 当参数只有一个的时候默认是给了自己的
    if (arguments.length === 1) {
      crudUrl = baseUrl
      baseUrl = ''
    }
    super(baseUrl)
    this.baseUrl = crudUrl || ''
  }

  /**
   * 查询全部
   * @param url
   * @returns { Promise<Array> }
   */
  fetchAll(url = this.baseUrl) {
    return super.fetch(url)
  }

  /**
   * 条件查询列表
   * @param url<String>?
   * @param params<Object>?
   * @returns { Promise<Array> }
   */
  fetchListByFilter(params, url = this.baseUrl) {
    return super.fetch(url, params)
  }

  /**
   * 更新数据
   * @param url
   * @param params
   * @returns { Promise }
   */
  update(url = this.baseUrl, params) {
    if (!params) return
    return super.post(url, params)
  }

  /**
   * 根据 id 更新数据
   * @param url
   * @param id
   * @param params
   * @returns { Promise }
   */
  updateById(id, params, url = this.baseUrl) {
    if (!id) return
    return super.post(url, { id, ...params })
  }

  /**
   * 创建
   * @param url
   * @param params
   * @returns { Promise }
   */
  create(params, url = this.baseUrl) {
    if (!params) return
    if (params.length < 1)
    return super.post(url, params)
  }

  /**
   * 根据 id 删除对象
   * @param url
   * @param id
   * @returns { Promise }
   */
  deleteById(id, url = this.baseUrl) {
    if (!id) return
    return super.post(url, { id })
  }

  /**
   * 自定义条件删除
   * @param url<String>
   * @param params<Object>
   * @returns { Promise }
   */
  deleteByFilter(params, url = this.baseUrl) {
    if (!params) return
    if (params.length < 1) return
    return super.post(url, params)
  }
}
```

> bus.js 我这里使用的是 Vue 环境

```javascript
import Vue from 'vue'

const VueBus = new Vue()

VueBus.$on('createError', (response) => {
  // ...
})
export default VueBus
```
