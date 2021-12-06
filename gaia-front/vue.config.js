module.exports = {
  css: {
    loaderOptions: {
      sass: {
        additionalData: `
          @import './src/main.scss';
        `
      }
    }
  },
  chainWebpack: (config) => {
    // Pug Loader
    config.module
    .rule('pug')
    .test(/\.pug$/)
    .use('pug-plain-loader')
    .loader('pug-plain-loader')
    .end();
  },
  productionSourceMap: process.env.NODE_ENV != 'production',
}
