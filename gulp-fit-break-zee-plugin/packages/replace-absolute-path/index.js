const through = require('through2');

/**
 * 绝对路径变相对路径
 * 如:
 *  /src/aaa/bbb/ccc/d.js -> ../../../d.js
 * 检测 async 使用情况 && 引入 regeneratorRuntime
 * */
function replaceAbsolutePath() {
    return through.obj(function(file, enc, cb) {
        const pathBaseOnSrc = file.path.replace(file.base, '');
        const depthArray = pathBaseOnSrc.replace(/^[/\\]+/, '').match(/[/\\]/g);
        const levels = depthArray ? depthArray.length : 0;
        const relativePath = './' + '../'.repeat(levels);
        let contents = file.contents.toString();
        contents = judgeAsync(contents, relativePath);
        contents = contents.replace(/[/\\]src[/\\]/g, relativePath);
        file.contents = Buffer.from(contents);
        this.push(file);
        cb();
    });
}

/**
 * 判断是否使用了async 并 引入 runtime.min.js
 * */
function judgeAsync(contents, relativePath) {
    if (!/async/.test(contents)) return contents;
    const array = contents.split(/<\/?script>/);
    if (array.length != 3) return contents;
    array[1] = `import regeneratorRuntime from '${relativePath}lib/runtime.min.js'
                ` + array[1];
    return array[0] + `<script>` + array[1] + `</script>` + array[2];
}

module.exports = replaceAbsolutePath;
