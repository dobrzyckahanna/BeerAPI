const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
var webpack = require("webpack");

const distDir = path.resolve(__dirname, "dist");

module.exports = {
  entry: ["@babel/polyfill", "./src/js/index.js"],
  output: {
    filename: "index.js",
    path: distDir
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: "src/index.html"
    }),
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery",
      "window.jQuery": "jquery"
    })
  ],
  mode: "development",
  devtool: "eval",
  devServer: {
    contentBase: distDir
  },
  module: {
    rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader']
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "fonts/[name].[ext]"
          }
        }
      }
    ]
  }
};