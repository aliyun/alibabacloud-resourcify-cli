'use strict';
const output = require('../../../output.js');
exports.cmdObj = {
  use: 'arc version',
  desc: {
    zh: '获取当前程序版本',
    en: `Get the current program version`
  }
};

exports.run = function () {
  let info = require('../package.json');
  output.log(info.version);
};