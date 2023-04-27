const HtmlWebPackPlugin = require('html-webpack-plugin')
    , CopyWebPackPlugin = require('copy-webpack-plugin')
    , webpack = require('webpack')
    , path = require('path')

module.exports = (env, options) => ({
  entry: [
    'babel-polyfill',
    './src/index.tsx',
  ],
  
  output: {
    path: path.join(__dirname, 'dist'),
    filename: `app.js?${(+new Date).toString(32).substr(-5)}`,
    publicPath: '/',
  },

  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },

  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
    devMiddleware: {
      writeToDisk: true
    },
    proxy: {
     '/**': {
      target: 'http://localhost:9097',
      secure: false,
      changeOrigin: true
     }
    }
  },

  // dev server on prod
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader'
        }
      }
    ]
  },

  plugins: [
    new CopyWebPackPlugin({
      patterns: [{
        from: path.resolve(__dirname, 'public')
      }]
    }),
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html',
    }),
    new webpack.DefinePlugin({
      'process.env.API_BASE_URL': JSON.stringify(process.env.API_BASE_URL),
    })
  ]
})