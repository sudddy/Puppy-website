const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

const baseConfig = env => {
  console.log("node_env:", env.NODE_ENV);
  const isProd = env.NODE_ENV === "production" ? true : false;
  const cleanPlugin = isProd ? [new CleanWebpackPlugin()] : [];
  return {
    entry: {
      index: "./src/js/index.js"
    },
    output: {
      path: __dirname + "/build",
      publicPath: "",
      filename: "./script/[name].[hash:20].js"
    },
    optimization: {
      minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})]
    },
    module: {
      rules: [
        {
          test: /\.(png|svg|jpe?g|gif|ttf|eot|woff2?|mp4)$/,
          use: [
            {
              loader: "file-loader",
              // loader: "url-loader",
              options: {
                limit: 10000,
                name: "./asset/[name].[hash:8].[ext]"
              }
            }
          ]
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: "html-loader",
              options: {
                minimize: true,
                attrs: ["source:src", "img:src"]
              }
            }
          ]
        },
        {
          test: /\.css$/,
          // use: ["style-loader", "css-loader"]
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                // you can specify a publicPath here
                // by default it use publicPath in webpackOptions.output
                publicPath: "../"
              }
            },
            "css-loader"
          ]
        },
        {
          test: /\.scss$/,
          // use: ["style-loader", "css-loader"]
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                // you can specify a publicPath here
                // by default it use publicPath in webpackOptions.output
                publicPath: "../"
              }
            },
            "css-loader",
            {
              loader: require.resolve("postcss-loader"),
              options: {
                // Necessary for external CSS imports to work
                ident: "postcss",
                plugins: () => [
                  require("postcss-flexbugs-fixes"),
                  require("postcss-preset-env")({
                    autoprefixer: {
                      flexbox: "no-2009"
                    },
                    stage: 3
                  })
                ]
              }
            },
            "sass-loader"
          ]
        }
      ]
    },
    plugins: [
      ...cleanPlugin,
      new CopyPlugin([
        {
          from: "dist"
        }
      ]),
      new HtmlWebPackPlugin({
        //inject: false,
        chunks: ["index"],
        // inject: true,
        template: "./src/html/index.html",
        filename: "./index.html"
      }),

      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        //chunkFilename: "[id].css"
        filename: "./style/[name].css"
      })
    ]
  };
};

// Return Array of Configurations
module.exports = [baseConfig];
