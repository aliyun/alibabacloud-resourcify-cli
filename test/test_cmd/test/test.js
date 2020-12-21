'use strict';

exports.cmdObj = {
  desc: {
    zh: '普通类型选项解析'
  },
  options: {
    flag: {},
    'number-flag': {
      alias: 'n',
      vtype: 'number',
    },
    'boolean-flag': {
      vtype: 'boolean'
    },
    'unrecognized-flag': {
      vtype: 'unrecognized'
    },
    'unchanged-flag': {
      vtype: 'string',
      unchanged: true,
      default: 'unchanged'
    }
  }
};

exports.run = function () { };