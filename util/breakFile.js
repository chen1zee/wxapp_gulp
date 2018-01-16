const colorConsole = require('./colorConsole');
/**
 * @func 将文件str内容转换为小程序对应的 js, wxss, wxml, json
 * @param {String} content
 * @return {Array} contentArray [wxml, js, json, less] 不一定为4项，如wxml = null 时， 数组为 [js, json, less]
 * @return {Object} contentArray[0] -> { ext: 'ext', content: 'String' }
 * */
function breakFile(content) {
    const breakFileObj = new BreakFileObj(content);
    breakFileObj.break();
    return breakFileObj.contentArray;
}

/**
 * @class 处理文件 类
 * @param {Array} contentArray 文件数组
 * */
//
class BreakFileObj {
    constructor(content) {
        // this.js = null;
        // this.less = null;
        // this.wxml = null;
        // this.json = null;
        this.contentArray = [];
        this.content = content;
    }
    breakWxml() {
        this.content = this.content.split(/<\/?template>/);
        if (this.content.length == 3) { // 有 template 标签
            if (/^[\W]*$/.test(this.content[1])) {
                this.wxml = null;
            } else { // 有 wxml
                this.contentArray.push({ // 推入 wxml
                    ext: 'wxml',
                    content: this.content[1]
                });
            }
            return (this.content = this.content[2]);
        }
        // 无 wxml
        this.content = this.content[0];
    }
    breakJsJson() {
        this.content = this.content.split(/<\/?script>/);
        let jsAndJson = this.content[1];
        this.contentArray.push({ // 推入 js
            ext: 'js',
            content: this.content[1]
        });
        jsAndJson = jsAndJson.replace(/(^[\w\W]*?(Page|Component|App)\()|\)[^)]*?$/g, '');
        let temObj;
        try {
            temObj = eval(`(function(){return ${jsAndJson}})()`);
        } catch (e) {
            colorConsole.error(`gulp-zee-to-wxapp/breakFile.js : 页面 eval String -> js Object 出错`);
            colorConsole.error(`${e}`);
        }
        if (temObj.config) { // 有json字段
            this.contentArray.push({ // 推入 json
                ext: 'json',
                content: JSON.stringify(temObj.config)
            });
        }
        this.content = this.content[2]
    }
    breakLess() {
        this.content = this.content.split(/<\/?style[^>]*>/);
        if (this.content.length == 3 && !/^[\W]*$/.test(this.content[1])) { // 有 less
            this.contentArray.push({ // 推入 less
                ext: 'less',
                content: this.content[1]
            });
        }
    }
    break() {
        this.breakWxml();
        this.breakJsJson();
        this.breakLess();
    }
}

module.exports = breakFile;