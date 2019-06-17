'use strict';
const nodeEnv = process.env.NODE_ENV;
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
  entry : './src/main.js',
  output : {
    // 输出文件配置，output 输出有自己的一套规则，常用的参数基本就是这三个
    // path: 表示生成文件的根目录 需要一个**绝对路径** path仅仅告诉Webpack结果存储在哪里
    path : path.resolve(__dirname,'dist'),
    // filename 属性表示的是如何命名出来的入口文件
    filename : './js/bundle.js',
    hotUpdateChunkFilename: 'hot/hot-update.js',
    hotUpdateMainFilename: 'hot/hot-update.json'
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
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          // {
          //   loader:'postcss-loader',
          //   options: {
          //     ident: 'postcss',
          //     plugins: (loader) => [    //postcss-loader的插件
          //         //require('postcss-import')({root: loader.resourcePath}),  //将css文件中的通过@import导入的css打包在一起
          //         // require('postcss-cssnext')(),
          //         require('autoprefixer')({   //自动添加浏览器前缀名
          //           'browsers': ['> 1%', 'last 2 versions']
          //         }),
          //         // require('cssnano')()
          //     ]
          //   }
          // },
         'less-loader'
        ]
      },
      {
        test : /\.css$/,
        use : [{loader : "style-loader"},{loader : "css-loader"}]
      },
      {
        test: /\.(png|gif|jpg|jpe?g|bmp)$/i,
        use : [
          {
            loader : 'url-loader',
            options : {
              limit : '8192'
            }
          }
          // mozjpeg — Compress JPEG images
          // optipng — Compress PNG images
          // pngquant — Compress PNG images
          // svgo — Compress SVG images
          // gifsicle — Compress GIF images
          //{
            //loader:'image-webpack-loader',
            //添加以下配置后会报错，应该和webpack版本
            // options: {
            //   mozjpeg: {
            //     progressive: true,
            //     quality: 65
            //   },
            //   // optipng.enabled: false will disable optipng
            //   optipng: {
            //     optimizationLevel: 7,
            //   },
            //   pngquant: {
            //     quality: '65-90',
            //     speed: 4
            //   },
            //   gifsicle: {
            //     interlaced: false,
            //   },
            //   // the webp option will enable WEBP
            //   webp: {
            //     quality: 75
            //   }
            // }
          //}
        ]
      },
      {
        test: /\.(woff|woff2|svg|ttf|eot)($|\?)/i,
        use: {
          loader: 'url-loader',
          options: {
            limit: '8192'
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
    //new ExtractTextPlugin('css/[name].[chunkhash:8].css'),
    // 热加载插件
    new webpack.HotModuleReplacementPlugin(),

    // 可在业务 js 代码中使用 __DEV__ 判断是否是dev模式（dev模式下可以提示错误、测试报告等, production模式不提示）
    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(JSON.parse((process.env.NODE_ENV == 'dev') || 'false'))
    }),

  ],
  //我们在这里对webpack-dev-server进行配置,这个配置在没有的情况下，端口默认是8080，且webpack-dev-server默认热更新（即使不设置）
  devServer: {
    contentBase:"./",// 本地服务器在哪个目录搭建页面，一般我们在当前目录即可；
    historyApiFallback:true,//当我们搭建spa应用时非常有用，它使用的是HTML5 History Api，任意的跳转或404响应可以指向 index.html 页面；
    inline:true,//用来支持dev-server自动刷新的配置，webpack有两种模式支持自动刷新，一种是iframe模式，一种是inline模式；使用iframe模式是不需要在devServer进行配置的，只需使用特定的URL格式访问即可；不过我们一般还是常用inline模式，在devServer中对inline设置为true后，当我们启动webpack-dev-server时仍要需要配置inline才能生效
    hot:true,// 启动webpack热模块替换特性,这里是个坑
    port:8080,//配置服务端口号
    host:'localhost',//服务器的IP地址，可以使用IP也可以使用localhost
    compress:true,//服务端压缩是否开启
  }
}
