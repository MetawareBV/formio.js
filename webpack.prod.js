const _ = require('lodash');
const webpack = require('webpack');
const packageJSON = require('./package.json');
module.exports = _.merge({}, require('./webpack.config'), {
  mode: 'production',
  output: {
    filename: '[name].min.js'
  },
  optimization: {
    // `mode: 'production'` enables ModuleConcatenationPlugin (scope hoisting) by default, which
    // can reorder how modules initialize relative to each other. This codebase's class hierarchy
    // (Component/NestedComponent/Components/Form/FormBuilder/Builders/...) is genuinely circular,
    // and concatenation breaks it: `class X extends Y` ends up evaluated before Y's module has
    // finished initializing, throwing "Class extends value undefined is not a constructor" —
    // reliably on the `formio.full` entry (FormBuilder + Builders pull in enough cross-references
    // to hit this), intermittently possible on the others. Regular (non-concatenated) webpack
    // modules tolerate this circularity fine since each require() is resolved lazily at its
    // callsite, so disable just this optimization; Terser minification is unaffected.
    concatenateModules: false,
  },
  plugins: [
    new webpack.DefinePlugin({
      FORMIO_VERSION: `'${packageJSON.version}'`
    }),
    new webpack.IgnorePlugin({
      resourceRegExp: /^\.\/locale$/,
      contextRegExp: /moment$/
    }),
    new webpack.BannerPlugin(
      `formiojs v${packageJSON.version} | https://unpkg.com/formiojs@${packageJSON.version}/LICENSE.txt`
    )
  ]
});
