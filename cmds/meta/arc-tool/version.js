'use strict';
const output = require('../../../lib/output.js');
exports.cmdObj = {
  desc: {
    zh: '获取当前程序版本',
    en: `Get the current program version`
  }
};

exports.run = function () {
  let info = require('../../../package.json');
  output.log(info.version);
};