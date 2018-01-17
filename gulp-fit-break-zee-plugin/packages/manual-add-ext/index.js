const through = require('through2');

const colorConsole = require('../../../util/colorConsole');

/**
 * @func 添加 vinyl File ext字段
 * @param {String} ext 后缀 wxml, js, json, less
 * */
function manualAddExt(ext) {
    if (['wxml', 'js', 'json', 'less'].indexOf(ext) == -1) {
        colorConsole.error(`manual-add-ext 错误 ext:${ext} 不合法`);
        throw new Error(null);
    }
    return through.obj(function(file, enc, cb) {
        file.ext = ext;
        this.push(file);
        cb();
    });
}

module.exports = manualAddExt;
