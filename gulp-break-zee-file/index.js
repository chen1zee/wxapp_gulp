const through = require('through2');
const breakFile = require('../util/breakFile');
const makeVinylFile = require('../util/makeVinylFile');
const colorConsole = require('../util/colorConsole');
const returnTimeUsed = require('../util/returnTimeUsed');

/**
 * @func 处理zee文件
 * @description 向流推入 js,json,wxml,less 4个chunk
 * */
function gulpBreakZeeFile() {
    return through.obj(function(file, enc, cb) {
        const beginTimeStamp = new Date().getTime();
        const vinylPublicOption = {
            cwd: file.cwd,
            base: file.base,
            pathWithoutExt: file.path.replace(/\.\w+$/, '')
        };
        try {
            const afterBreakArray = breakFile(file.contents.toString());
            for (let i = afterBreakArray.length; i--;) {
                this.push(makeVinylFile(
                    vinylPublicOption,
                    afterBreakArray[i].ext,
                    Buffer.from(afterBreakArray[i].content)
                ));
            }
            colorConsole.info(
                `[${returnTimeUsed(beginTimeStamp)}] 完成 breakZeeFile
                ${file.path}`
            );
        } catch(e) {
            colorConsole.error(`${file.path} 在 gulpZeeToWxapp 流处理中出错`);
            colorConsole.error(`${e}`);
        } finally {
            cb();
        }
    });
}

module.exports = gulpBreakZeeFile;