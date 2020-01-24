/**
 * @description
 * Browser specific output - to handle booting up react and other
 * interactive tings.
 */

const path = require("path"),
  webpack = require("webpack"),
  TerserPlugin = require("terser-webpack-plugin"),
  AssetsPlugin = require("assets-webpack-plugin"),
  HtmlWebpackPlugin = require("html-webpack-plugin"),
  Stylish = require("webpack-stylish"),
  // ENV VARIABLES
  IS_PRODUCTION = process.env.NODE_ENV === "production",
  IS_DEVELOPMENT = process.env.NODE_ENV === "development",
  // PATHS
  publicPath = "/",
  browserEntry = path.resolve(__dirname, "src/browser"),
  outputPath = path.resolve(__dirname, "dist/browser"),
  OUTPUT_MANIFEST_PATH = "dist/browser/manifest.json"

module.exports = {
  context: __dirname,

  mode: IS_PRODUCTION ? "production" : IS_DEVELOPMENT && "development",

  bail: IS_PRODUCTION,

  // Might have to be none...?
  devtool: IS_PRODUCTION ? "none" : "cheap-module-source-map",

  // node: IS_PRODUCTION ? false : void 0,

  entry: browserEntry,

  output: {
    path: outputPath,
    pathinfo: IS_DEVELOPMENT,
    filename: "js/[name]-[hash].js",
    chunkFilename: "js/[name]-[chunkhash:8].chunk.js",
    publicPath,
    devtoolModuleFilenameTemplate: "[absolute-resource-path]",
    devtoolFallbackModuleFilenameTemplate: "[absolute-resource-path]?[hash]"
  },

  optimization: {
    minimize: false,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: { ecma: 8 },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2
          },
          mangle: { safari10: true },
          output: {
            ecma: 8,
            comments: false,
            ascii_only: true
          }
        },
        parallel: true,
        cache: true
      })
    ],
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        default: false,
        vendors: false,
        framework: {
          chunks: "all",
          name: "react",
          test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription|object-assign)[\\/]/,
          priority: 40,
          enforce: true
        },
        ["data-mgmt"]: {
          chunks: "all",
          name: "data-mgmt",
          test: /(?<!node_modules.*)[\\/]node_modules[\\/](urql|graphql|wonka|react-wonka)[\\/]/,
          priority: 40,
          enforce: true
        },

        vendor: {
          test: /[\\/]node_modules[\\/]/,
          minChunks: 1,
          priority: 30
        },
        commons: {
          name: "commons",
          minChunks: 3,
          priority: 20
        }
      },
      maxInitialRequests: 25,
      minSize: 20000
    },
    runtimeChunk: true
  },

  resolve: {
    modules: ["node_modules"],
    extensions: [".ts", ".tsx", ".mjs", ".js", ".json", ".jsx"]
  },

  module: {
    strictExportPresence: true,
    rules: [
      { parser: { requireEnsure: false } },

      {
        oneOf: [
          {
            test: /\.tsx?$/,
            exclude: /node_modules/,
            use: {
              loader: require.resolve("babel-loader")
            }
          },

          {
            type: "javascript/auto",
            test: /\.mjs$/,
            use: []
          }
        ]
      }
    ]
  },

  plugins: [
    // urql's dependency on graphql also has us depending on Node's Buffer, which
    // we will not have access to within the worker.
    IS_DEVELOPMENT && new webpack.HotModuleReplacementPlugin(),
    // new webpack.ProvidePlugin({ Buffer: "buffer" }),
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, "src/index.html")
    }),
    new AssetsPlugin({ filename: OUTPUT_MANIFEST_PATH }),
    new Stylish()
  ].filter(Boolean),

  watch: IS_DEVELOPMENT,
  performance: false,
  stats: "none",

  devServer: {
    compress: true,
    contentBase: browserEntry,
    watchContentBase: true,
    host: "0.0.0.0",
    publicPath,
    quiet: true,
    overlay: true,
    hot: true,
    historyApiFallback: {
      disableDotRule: true
    }
  }
}
