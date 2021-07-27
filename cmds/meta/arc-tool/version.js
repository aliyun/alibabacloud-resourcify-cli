'use strict';

exports.cmdObj = {
  desc: {
    zh: '获取当前程序版本',
    en: `Get the current program version`
  }
};

exports.run = function () {
  const info = require('../../../package.json');
  console.log(info.version);
};