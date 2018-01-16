/**
 * 做了 gulp-break-zee-file 适配的 gulp 中间件(transform)
 * 适配方法
 * gulp 插件中
 * through.obj(function(file, enc, cb) {
 *      // 用 ext 来判断是否需要本插件处理
 *      if (file.ext != 'js') {
 *          this.push(file);
 *          return cb();
 *      }
 *      // 若是js运行正常插件业务
 *      someHandler(file);
 *      ...other code;
 * })
 * */
const babel = require('./packages/babel/index');
const sourcemaps = require('./packages/sourcemaps/index');
const less = require('./packages/less/index');
const replaceAbsolutePath = require('./packages/replace-absolute-path/index');

const gulpFitBreakZeePlugin = {
    babel,
    sourcemaps,
    less,
    replaceAbsolutePath
};

module.exports = gulpFitBreakZeePlugin;
