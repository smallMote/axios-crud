import CrudAPI from '@/api/crud'

export default class DeBug extends CrudAPI {
  constructor() {
    super('/api', '/user')
  }
}