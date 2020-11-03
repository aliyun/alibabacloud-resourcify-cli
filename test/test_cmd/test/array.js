'use strict';

exports.cmdObj = {
  desc: {
    zh: 'array类型选项解析'
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
    },
    'map-flag': {
      vtype: 'array',
      subType: 'map',
      options: {
        key: {},
        value: {}
      }
    }
  }
};

exports.run = function () { };