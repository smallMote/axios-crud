<template>
  <div class="debug">
    <div class="btn" @click="d_fetch()">Fetch All</div>
    <div class="btn" @click="d_fetchFilter()">Fetch Filter</div>
    <div class="btn" @click="d_updateById()">Update By Id</div>
    <div class="btn" @click="d_deleteById()">Delete By Id</div>
    <div class="view-container" v-text="data"></div>
  </div>
</template>

<script>
import { reactive } from '@vue/composition-api'
import DeBug from './debug.test'
const deBug = new DeBug()
export default {
  name: 'DeBug',
  props: {
    msg: String
  },
  setup() {
    let data = reactive({
      result: 'no anything'
    })

    const d_fetch = async () => {
      const result = await deBug.fetchAll()
      // console.log(result) // eslint-disable-line
      data.result = result
    }

    const d_fetchFilter = async () => {
      const result = await deBug.fetchListByFilter({ id: 1 })
      data.result = result
    }

    const d_updateById = async () => {
      const result = await deBug.updateById(1, { account: 'SuperAdmin', action: 'UPD'})
      data.result = result
    }

    const d_deleteById = async () => {
      const result = await deBug.updateById(3, { action: 'DEL' })
      data.result = result
    }

    return {
      data,
      d_fetch,
      d_fetchFilter,
      d_updateById,
      d_deleteById
    }
  }
}
</script>
<style>
.btn {
  background: seagreen;
  display: inline-block;
  padding: 6px 12px;
  margin: 6px;
  border-radius: 6px;
  color: #ffffff;
  cursor: default;
  transition: 0.4s ease
}
.btn:hover {
  background: green
}
</style>
<style scoped>
.view-container {
  border-radius: 6px;
  border: 1px solid seagreen;
  min-height: calc(300px - 12px);
  width: calc(100% - 36px);
  margin: 12px;
  padding: 6px;
}
</style>
