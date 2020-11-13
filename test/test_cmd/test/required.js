'use strict';

exports.cmdObj = {
  desc: {
    zh: '必选参数校验'
  },
  options: {
    flag: {},
    'boolean-flag': {
      vtype: 'boolean',
      required: true
    },
  }
};

exports.run = function () { };