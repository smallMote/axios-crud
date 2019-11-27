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
