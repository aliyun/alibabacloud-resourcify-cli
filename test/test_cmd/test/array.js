'use strict';

exports.cmdObj = {
  desc: {
    zh: 'map类型选项解析'
  },
  options: {
    flag: {
      vtype: 'array',
      subType: 'string',
      options: {
        element: {}
      }
    },
    'number-flag': {
      vtype: 'array',
      maxindex: 3,
      subType: 'number',
      options: {
        element: {}
      }
    }
  }
};

exports.run = function () { };