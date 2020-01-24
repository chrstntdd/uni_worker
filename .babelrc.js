const IS_PRODUCTION = process.env.NODE_ENV === "production"
const IS_DEV = process.env.NODE_ENV === "development"

module.exports = {
  sourceMaps: true,
  presets: [
    require.resolve("@babel/preset-typescript"),
    [
      "@babel/preset-env",
      {
        targets: {
          node: "current"
        }
      }
    ]
  ],
  plugins: [
    [
      require.resolve("@babel/plugin-proposal-class-properties"),
      { loose: true }
    ],
    [require.resolve("@babel/plugin-transform-react-jsx")],
    !IS_PRODUCTION && [
      require.resolve("@babel/plugin-transform-react-jsx-source")
    ]
  ].filter(Boolean)
}
