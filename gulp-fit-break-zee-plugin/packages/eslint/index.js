const through = require('through2');
const CLIEngine = require('eslint').CLIEngine;
const formatter = require('eslint-friendly-formatter');
const colorConsole = require('../../../util/colorConsole');

function eslint(eslintOption) {
    return through.obj(function(file, enc, cb) {
        if (file.ext != 'js') {
            this.push(file);
            return cb();
        }
        const cli = new CLIEngine(eslintOption);
        const report = cli.executeOnFiles([file.path]);
        const results = report.results || [];
        const output = formatter(results);
        console.log(output);
        if (!output) {
            colorConsole.info(`通过eslint检测
            ${file.path}`);
        }
        this.push(file);
        cb();
    });
}

module.exports = eslint;
