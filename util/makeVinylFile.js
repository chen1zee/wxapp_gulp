const Vinyl = require('vinyl');

/**
 * @func 制作 vinyl 格式 fileObject
 * @param {Object} vinylPublicOption
 * @param {String} vinylPublicOption.cwd 当前工作目录
 * @param {String} vinylPublicOption.base glob解析的基础路径
 * @param {String} vinylPublicOption.pathWithoutExt 路径
 * @param {String} ext 后缀(不含'.')
 * @param {Buffer} contents Buffer内容
 *
 * @return {Object} vinylFileObject
 * @return {String} vinylFileObject.ext: 后缀，用以判断 流处理
 * */
function makeVinylFile(vinylPublicOption, ext, contents) {
    return new Vinyl({
        cwd: vinylPublicOption.cwd,
        base: vinylPublicOption.base,
        path: vinylPublicOption.pathWithoutExt + '.' + ext,
        contents, ext
    });
}

module.exports = makeVinylFile;
