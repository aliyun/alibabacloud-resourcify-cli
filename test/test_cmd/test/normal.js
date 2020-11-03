'use strict';

exports.cmdObj = {
  desc: {
    zh: '普通类型选项解析'
  },
  options: {
    flag: {},
    'number-flag': {
      vtype: 'number'
    },
    'boolean-flag': {
      vtype: 'boolean'
    }
  }
};

exports.run = function () { };