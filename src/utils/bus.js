/* eslint-disable */
import Vue from 'vue'

const VueBus = new Vue()

VueBus.$on('createError', (response) => { // eslint-disable-line
  // ...
  console.log(response)
})
export default VueBus
