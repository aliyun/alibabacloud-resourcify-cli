'use strict';

exports.cmdObj = {
  desc: {
    zh: '补充测试'
  },
  usage: [
    'arc-test test supplement <virtualArgs>'
  ],
  options: {
    flag: {
      desc: {
        zh: '测试flag'
      },
      alias: 'f',
      choices: [
        'value1',
        'value2'
      ],
      example: 'value'
    },
  }
};

exports.run = function () { };