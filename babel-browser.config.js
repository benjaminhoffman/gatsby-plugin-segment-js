module.exports = {
  extends: "./babel.config",
  presets: [
    // TODO: Figure out if we should specify some browser targets here, or if Gatsby will re-transpile them or what.
    "@babel/preset-env",
    "@babel/preset-react",
  ],
}