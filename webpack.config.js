const path = require("path"),
  TerserPlugin = require("terser-webpack-plugin"),
  // ENV VARIABLES
  IS_PRODUCTION = process.env.NODE_ENV === "production",
  IS_DEVELOPMENT = process.env.NODE_ENV === "development",
  // PATHS
  publicPath = "dist",
  workerEntry = path.resolve(__dirname, "index"),
  outputPath = path.resolve(__dirname, "dist")

module.exports = {
  context: __dirname,

  target: "webworker",

  mode: IS_PRODUCTION ? "production" : IS_DEVELOPMENT && "development",

  bail: IS_PRODUCTION,

  devtool: IS_PRODUCTION ? "source-map" : "cheap-module-source-map",

  node: false,

  entry: workerEntry,

  output: {
    path: outputPath,
    pathinfo: IS_DEVELOPMENT,
    filename: "worker.js",
    publicPath,
    devtoolModuleFilenameTemplate: "[absolute-resource-path]",
    devtoolFallbackModuleFilenameTemplate: "[absolute-resource-path]?[hash]",
  },

  optimization: {
    minimize: IS_PRODUCTION,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: { ecma: 8 },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
          },
          mangle: { safari10: true },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
        parallel: true,
        cache: true,
        sourceMap: true,
      }),

      // new OptimizeCSSAssetsPlugin({
      //   cssProcessorOptions: {
      //     map: {
      //       inline: false,
      //       annotation: true,
      //     },
      //   },
      // }),
    ],
  },

  resolve: {
    modules: ["node_modules"],
    extensions: [".ts", ".tsx", ".mjs", ".js", ".json", ".jsx"],
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
              loader: require.resolve("babel-loader"),
            },
          },

          {
            type: "javascript/auto",
            test: /\.mjs$/,
            use: [],
          },
        ],
      },
    ],
  },

  watch: IS_DEVELOPMENT,
  performance: false,
  stats: "minimal",
}
