const through = require('through2');

/**
 * 绝对路径变相对路径
 * 如:
 *  /src/aaa/bbb/ccc/d.js -> ../../../d.js
 * */
function replaceAbsolutePath() {
    return through.obj(function(file, enc, cb) {
        const pathBaseOnSrc = file.path.replace(file.base, '');
        const levels = pathBaseOnSrc.match(/[/\\]/g).length;
        const relativePath = './' + '../'.repeat(levels);
        let contents = file.contents.toString();
        contents = contents.replace(/[/\\]src[/\\]/g, relativePath);
        file.contents = Buffer.from(contents);
        this.push(file);
        cb();
    });
}

module.exports = replaceAbsolutePath;
