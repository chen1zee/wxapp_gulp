const path = require('path');
const gulp = require('gulp');
const watch = require('gulp-watch');
const plumber = require('gulp-plumber'); // 处理 异常 不退出 运行时
const gulpBreakZeeFile = require('./gulp-break-zee-file/index.js');
const gulpFitBreakZeePlugin = require('./gulp-fit-break-zee-plugin/index.js');
const colorConsole = require('./util/colorConsole');
const eslintConfig = require('./.eslintrc.js');

gulp.task('break-zee-file', zeeFileHandler.bind(gulp.src('src/**/*.zee')));
gulp.task('lib-js-file', libJsFileHandler.bind(gulp.src('src/lib/**/*.js', { base: path.join(__dirname, 'src/') })))
gulp.task('es6-js-file', es6JsFileHandler.bind(gulp.src(['src/!(lib)/*.js', 'src/!(lib)/**/*.js', 'src/*.js'], { base: path.join(__dirname, 'src/') })))
gulp.task('less-file', lessFileHandler.bind(gulp.src('src/**/*.less')));
gulp.task('source-file', sourceFileHandler.bind(gulp.src('src/**/*.{png,gif,jpg,jpeg}')));

gulp.task('watch', [
    'source-file',
    'lib-js-file',
    'break-zee-file',
    'es6-js-file',
    'less-file'
], () => {
    sourceFileHandler.call(watchOnlyAddChange('src/**/*.{png,gif,jpg,jpeg}'));
    zeeFileHandler.call(watchOnlyAddChange('src/**/*.zee'));
    libJsFileHandler.call(watchOnlyAddChange('src/lib/**/*.js', { base: path.join(__dirname, 'src/') }));
    es6JsFileHandler.call(watchOnlyAddChange(['src/!(lib)/*.js', 'src/!(lib)/**/*.js', 'src/*.js'], { base: path.join(__dirname, 'src/') }));
    gulp.watch('src/**/*.less', (e) => {
        // 只监听 修改
        if ('changed' != e.type) return;
        const glob = path.posix.normalize(e.path).replace(__dirname, '').replace(/\\/g, '/').replace(/^\//, '');
        gulp.src(glob, { base: 'src/' })
            .pipe(plumber())
            .pipe(gulp.dest('.template-for-zee-file'))
            .on('finish', () => {
                templateLessFileHandler.call(gulp.src('.template-for-zee-file/**/*.less'))
                    .on('finish', () => {
                        colorConsole.info(`完成 style/*.less 任务
                        ${glob}`);
                    });
            });
    });
});

/**
 * @func 只监听 添加 && 改变 事件
 * @param {Null} src 路径
 * @param {Object} opt 配置项对象
 * */
function watchOnlyAddChange(src, opt) {
    const mergeOpt = opt || {};
    mergeOpt.events = ['add', 'change'];
    return watch(src, mergeOpt);
}

/**
 * 处理 .zee文件
 * */
function zeeFileHandler() {
    return this
        .pipe(plumber())
        // 预处理
        .pipe(gulpFitBreakZeePlugin.replaceAbsolutePath())
        .pipe(gulpBreakZeeFile())
        // eslint 检测
        .pipe(gulpFitBreakZeePlugin.eslint(eslintConfig))
        // 缓存 分离文件
        .pipe(gulp.dest('.template-for-zee-file'))
        // 处理less
        .pipe(gulpFitBreakZeePlugin.less({
            paths: [path.join(__dirname, 'src/style')]
        }))
        .pipe(gulpFitBreakZeePlugin.cssToWxss())
        // 处理js
        // 微信开发者工具 不支持 sourcemaps
        // .pipe(gulpFitBreakZeePlugin.sourcemaps.init())
        .pipe(gulpFitBreakZeePlugin.babel())
        // .pipe(gulpFitBreakZeePlugin.sourcemaps.write('./sourcemaps'))
        .pipe(gulp.dest('dist'));
}
/**
 * 处理 lib/*.js 文件
 * 公共js库(es5), 只做copy，不转es6
 * */
function libJsFileHandler() {
    return this
        .pipe(plumber())
        .pipe(gulp.dest('dist'));
}
/**
 * 处理 其余用es6写的js(除lib外)
 * */
function es6JsFileHandler() {
    return this
        .pipe(plumber())
        .pipe(gulpFitBreakZeePlugin.manualAddExt('js'))
        .pipe(gulpFitBreakZeePlugin.replaceAbsolutePath())
        .pipe(gulpFitBreakZeePlugin.eslint(eslintConfig))
        .pipe(gulpFitBreakZeePlugin.babel())
        .pipe(gulp.dest('dist'));
}
/**
 * 处理 其余less文件
 * */
function lessFileHandler() {
    return this
        .pipe(plumber())
        .pipe(gulp.dest('.template-for-zee-file'))
        .pipe(gulpFitBreakZeePlugin.manualAddExt('less'))
        .pipe(gulpFitBreakZeePlugin.less({
            paths: [path.join(__dirname, 'src/style')]
        }))
        .pipe(gulpFitBreakZeePlugin.cssToWxss())
        .pipe(gulp.dest('dist'));
}
/**
 * 处理 .template-for-zee-file的less文件
 * */
function templateLessFileHandler() {
    return this
        .pipe(plumber())
        .pipe(gulpFitBreakZeePlugin.manualAddExt('less'))
        .pipe(gulpFitBreakZeePlugin.less({
            paths: [path.join(__dirname, '.template-for-zee-file/style')]
        }))
        .pipe(gulpFitBreakZeePlugin.cssToWxss())
        .pipe(gulp.dest('dist'));
}
/**
 * 处理 静态资源文件 (copy)
 * */
function sourceFileHandler() {
    return this
        .pipe(gulp.dest('dist'))
}
