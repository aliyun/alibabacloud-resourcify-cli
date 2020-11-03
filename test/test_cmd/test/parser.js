'use strict';

exports.cmdObj = {
  desc: {
    zh: '用于单元测试辅助'
  },
  options: {
    flag1: {
      required: true
    },
    flag2: {
      vtype: 'number'
    },
    flag3: {
      alias: 'f',
      vtype: 'boolean'
    },
    conflictFlag1: {
      required: true,
      conflicts: [
        'conflictFlag2'
      ]
    },
    conflictFlag2: {
      required: true,
      conflicts: [
        'conflictFlag1'
      ]
    }
  },
  args: [
    {
      name: 'arg1'
    }
  ]
};

exports.run = function (argv) {
  console.log('===========');
  console.log('parser run success');
  console.log(argv.parsedValue);
};