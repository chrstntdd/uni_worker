const path = require("path"),
  webpack = require("webpack"),
  TerserPlugin = require("terser-webpack-plugin"),
  // ENV VARIABLES
  IS_PRODUCTION = process.env.NODE_ENV === "production",
  IS_DEVELOPMENT = process.env.NODE_ENV === "development",
  // PATHS
  publicPath = "dist",
  workerEntry = path.join(__dirname, "src/worker"),
  outputPath = path.join(__dirname, "dist/worker")

module.exports = {
  context: __dirname,

  target: "webworker",

  mode: IS_PRODUCTION ? "production" : IS_DEVELOPMENT && "development",

  bail: IS_PRODUCTION,

  devtool: "none",

  node: false,

  entry: workerEntry,

  output: {
    path: outputPath,
    pathinfo: IS_DEVELOPMENT,
    filename: "worker-[hash].js",
    publicPath,
    devtoolModuleFilenameTemplate: "[absolute-resource-path]",
    devtoolFallbackModuleFilenameTemplate: "[absolute-resource-path]?[hash]"
  },

  optimization: {
    minimize: false
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
    new webpack.ProvidePlugin({
      Buffer: "buffer"
    })
  ],

  watch: IS_DEVELOPMENT,
  performance: false,
  stats: "minimal"
}
