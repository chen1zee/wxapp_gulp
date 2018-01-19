const shell = require('shelljs');
const path = require('path');

shell.rm('-rf', path.resolve(__dirname, '../.template-for-zee-file'));
shell.rm('-rf', path.resolve(__dirname, '../dist/*'));
console.log('成功删除 .template-for-zee-file && dist目录下文件夹');
