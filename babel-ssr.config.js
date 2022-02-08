module.exports = {
  extends: "./babel.config",
  presets: [
    [
      "@babel/preset-env",
      {
        "targets": {
          "node": "8",
        },
      },
    ],
    "@babel/preset-react",
  ],
}