// const address = require('address')
module.exports = {
  devServer: {
    proxy: {
      '/api': {
          target: 'http://localhost:3000',  // target host
          ws: true,  // proxy websockets 
          changeOrigin: true,  // needed for virtual hosted sites
          pathRewrite: {
            '^/api': ''  // rewrite path
          }
      }
    }
  }
}