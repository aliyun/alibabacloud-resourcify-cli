'use strict';

exports.cmdObj = {
  desc: {
    zh: '测试类型间关系逻辑'
  },
  options: {
    'opt1': {
      required: true,
      desc: {
        zh: '字符串型参数1'
      },
      conflicts: [
        'opt2'
      ]
    },
    'opt2': {
      required: true,
      desc: {
        zh: '字符串型参数2'
      },
      conflicts: [
        'opt1'
      ]
    },
    'opt3': {
      desc: {
        zh: '字符串型参数3'
      },
      sufficient: function (val) {
        let optList = {};
        if (val === 'next') {
          optList['opt4'] = false;
          optList['opt5'] = true;
        }
        return optList;
      }
    },
    'opt4': {
      desc: {
        zh: '字符串型参数4'
      },
      dependency: true
    },
    'opt5': {
      desc: {
        zh: '字符串型参数5'
      },
      dependency: true
    }
  }
};

exports.run = function (argv) {
  console.log('===========');
  console.log('relation run success');
  console.log(argv._parsedValue);
};