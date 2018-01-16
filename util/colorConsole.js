const chalk = require('chalk');

const colorConsole = {
    info(content) {
        console.log(`${chalk.green('[INFO] ' + returnMMSS())} ${content}`);
    },
    error(content) {
        console.log(`${chalk.red('[ERROR] ' + returnMMSS())} ${content}`);
    }
};
/* 放回当前时间 */
function returnMMSS() {
    const date = new Date();
    const m = date.getMinutes();
    const s = date.getSeconds();
    return `${m > 9 ? m : '0' + m.toString()}:${s > 9 ? s : '0' + s.toString()}`;
}

module.exports = colorConsole;
