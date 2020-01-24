const IS_PRODUCTION = process.env.NODE_ENV === "production"
const IS_DEV = process.env.NODE_ENV === "development"

const sharedConfig = {
  presets: [require.resolve("@babel/preset-typescript")],
  plugins: [
    [
      require.resolve("@babel/plugin-proposal-class-properties"),
      { loose: true },
    ],
    [require.resolve("@babel/plugin-transform-react-jsx")],
    !IS_PRODUCTION && [
      require.resolve("@babel/plugin-transform-react-jsx-source"),
    ],
  ].filter(Boolean),
}

const mainBabelConfig = {
  sourceMaps: true,
  ...sharedConfig,
}

module.exports = mainBabelConfig
