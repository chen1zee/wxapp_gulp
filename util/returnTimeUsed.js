/**
 * 返回 当前时间 - timeStamp 的用时 ms||s
 * */
function returnTimeUsed(timeStamp) {
    const time = new Date().getTime() - timeStamp;
    return time > 999 ? `${time / 1000}s` : `${time}ms`;
}

module.exports = returnTimeUsed;
