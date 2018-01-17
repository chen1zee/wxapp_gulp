const through = require('through2');

/**
 * @func .css -> 变成 -> .wxss 后缀
 * */
function cssToWxss() {
    return through.obj(function(file, enc, cb) {
        if (file.ext != 'less') {
            this.push(file);
            return cb();
        }
        file.path = file.path.replace(/\.(le|c)ss$/, '.wxss');
        this.push(file);
        cb();
    });
}

module.exports = cssToWxss;
