'use strict';
const nodeEnv = process.env.NODE_ENV;
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
//extract-text-webpack-plugin该插件的主要是为了抽离css样式,防止将样式打包在js中引起页面样式加载错乱的现象;
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
module.exports = {
  resolve: {
    //自动扩展文件后缀名，意味着我们require模块可以省略不写后缀名
    extensions: ['*', '.js', '.json', '.less','.jsx', '.scss'],
    //模块别名定义，方便后续直接引用别名，无须多写长长的地址
    alias: {
      '@components': path.join(__dirname,'../src/components/'),
      '@': path.join(__dirname,'../src/')
    }
  },
  // 配置需要打包的入口文件，值可以是字符串、数组、对象。
  // 1. 字符串： entry： './entry'
  // 2. 字符串： entry：[ './entry1','entry2'] (多入口)
  // 3. 对象：   entry： {alert/index': path.resolve(pagesDir, `./alert/index/page`)}
  // 多入口书写的形式应为object，因为object,的key在webpack里相当于此入口的name,
  entry:{
    main:'./src/main.js',
    // 将 第三方依赖 单独打包
    common: ['react', 'react-dom']
  },
  output : {
    // 输出文件配置，output 输出有自己的一套规则，常用的参数基本就是这三个
    // path: 表示生成文件的根目录 需要一个**绝对路径** path仅仅告诉Webpack结果存储在哪里
    path : path.resolve(__dirname,'../dist'),
    // filename 属性表示的是如何命名出来的入口文件
    filename : './js/[name].js',
  },
  module : {
    // 这里就是Loader，通过Loader，webpack能够针对每一种特定的资源做出相应的处理
    // 1.test参数用来指示当前配置项针对哪些资源，该值应是一个条件值(condition)。
    // 2.exclude参数用来剔除掉需要忽略的资源，该值应是一个条件值(condition)。
    // 3.include参数用来表示本loader配置仅针对哪些目录/文件，该值应是一个条件值(condition)。
    // 而include参数则用来指示目录；注意同时使用这两者的时候，实际上是and的关系。
    // 4.use参数，用来指示用哪个或哪些loader来处理目标资源。
    rules : [
      {
        test: /\.(js|jsx)$/,
        use : {
          loader : "babel-loader"
        },
        exclude : /node_modules/
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use : ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            'css-loader',
            {
              loader:'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: (loader) => [    //postcss-loader的插件
                    //require('postcss-import')({root: loader.resourcePath}),  //将css文件中的通过@import导入的css打包在一起
                    // require('postcss-cssnext')(),
                    require('autoprefixer')({   //自动添加浏览器前缀名
                        browsers: ['last 5 versions']
                    }),
                    // require('cssnano')()
                ]
              }
            },
           'less-loader']
        })
      },
      {
        test : /\.css$/,
        use : ExtractTextPlugin.extract({
          use : [
            {loader : "style-loader"},
            {loader : "css-loader"},
            {
              loader:'postcss-loader',
              options: {
                ident: 'postcss',
                plugins: (loader) => [    //postcss-loader的插件
                    //require('postcss-import')({root: loader.resourcePath}),  //将css文件中的通过@import导入的css打包在一起
                    // require('postcss-cssnext')(),
                    require('autoprefixer')({   //自动添加浏览器前缀名
                        browsers: ['last 5 versions']
                    }),
                    // require('cssnano')()
                ]
              }
            },
          ]
        })
      },
      {
        test: /\.(png|gif|jpg|jpe?g|bmp)$/i,
        use : [
          {
            loader : 'url-loader',
            options : {
              limit : '8192',
              outputPath: 'images/',
              publicPath : '/images'
            }
          },
          // {
          //   loader:'image-webpack-loader',
          //   options:{
          //     gifsicle: {
          //       interlaced: false,
          //     },
          //     optipng: {
          //       optimizationLevel: 7,
          //     },
          //     pngquant: {
          //       quality: '65-90',
          //       speed: 4
          //     },
          //     mozjpeg: {
          //       progressive: true,
          //       quality: 65
          //     },
          //     // Specifying webp here will create a WEBP version of your JPG/PNG images
          //     webp: {
          //       quality: 75
          //     }
          //   }
          // }
        ]
      },
      {
        test: /\.(woff|woff2|svg|ttf|eot)($|\?)/i,
        use: {
          loader: 'url-loader',
          options: {
            limit: '8192',
            outputPath: 'font/'
          }
        }
      }
    ]
  },
  plugins: [
    // html 模板插件
    new HtmlWebpackPlugin({
      template: path.join(__dirname,'../index.html')
    }),
    new ExtractTextPlugin('css/[name].[chunkhash:8].css'),
    // 为组件分配ID，通过这个插件webpack可以分析和优先考虑使用最多的模块，并为它们分配最小的ID
    new webpack.optimize.OccurrenceOrderPlugin(),
    // 定义为生产环境，编译 React 时压缩到最小
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    }),
    ///webpack4已移除UglifyJsPlugin
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     //supresses warnings, usually from module minification
    //     warnings: false
    //   }
    // }),
    // 提供公共代码
    // webpack.optimize.CommonsChunkPlugin has been removed, please use config.optimization.splitChunks instead
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'common', filename: 'js/[name].[chunkhash:8].js'
    // }),
    //压缩css
    new OptimizeCssAssetsPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano'),
      cssProcessorOptions: { discardComments: {removeAll: true } },
      canPrint: true
    })

  ]
}
