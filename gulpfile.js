const path = require('path');
const gulp = require('gulp');
const watch = require('gulp-watch');
const gulpBreakZeeFile = require('./gulp-break-zee-file/index.js');
const gulpFitBreakZeePlugin = require('./gulp-fit-break-zee-plugin/index.js');

/**
 * 处理 .zee 文件
 * */
gulp.task('break-zee-file', breakZeeFile.bind(gulp.src('src/**/*.zee')));


gulp.task('watch', ['break-zee-file'], () => {
    breakZeeFile.call(watch('src/**/*.zee'));
});

function breakZeeFile() {
    return this
        // 预处理
        .pipe(gulpFitBreakZeePlugin.replaceAbsolutePath())
        .pipe(gulpBreakZeeFile())
        // 处理less
        .pipe(gulpFitBreakZeePlugin.less({
            paths: [path.join(__dirname, 'src/style')]
        }))
        // 处理js
        .pipe(gulpFitBreakZeePlugin.sourcemaps.init())
        .pipe(gulpFitBreakZeePlugin.babel())
        .pipe(gulpFitBreakZeePlugin.sourcemaps.write('./sourcemaps'))
        .pipe(gulp.dest('dist'));
}