const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    port: '7777',
    // proxy: {
    //   '/': {
    //     target: 'http://selectiontest.92nu.com',
    //     ws: true,
    //     changOlrigin: true,   
    //   }
    // }
  },
})

// const path = require('path');
// function resolve (dir) {
//   return path.join(__dirname, dir)
// }
// module.exports = {  
//   devServer: {
//     proxy: {
//       '/': {
//         target: 'http://selectiontest.92nu.com',
//         ws: true,
//         changOlrigin: true,   
//       }
//     }
//   },
//   lintOnSave: false,
//   chainWebpack: (config)=>{
//     config.resolve.alias
//     .set('vendor',resolve('./src/vendor'))
//   },
//   configureWebpack: {
//     devtool: process.env.NODE_ENV === 'development' ? 'cheap-module-eval-source-map' : 'cheap-module-source-map',
//   }
// }
