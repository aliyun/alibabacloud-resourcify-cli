'use strict';

exports.cmdObj = {
  desc: {
    zh: '测试数组型参数'
  },
  options: {
    'string': {
      required: true,
      desc: {
        zh: '字符串型参数'
      }
    },
    'number': {
      vtype: 'number',
      desc: {
        zh: '数字型参数'
      }
    },
    'choices': {
      desc: {
        zh: '可选类型参数'
      },
      choices: [
        'this',
        'is',
        'me'
      ]
    },
    'boolean': {
      vtype: 'boolean',
      desc: {
        zh: '布尔值类型'
      }
    },
    'array': {
      vtype: 'array',
      subType: 'string',
      desc: {
        zh: '字符串数组参数'
      },
      options: {
        element: {
          desc: {
            zh: '字符串'
          }
        }
      }
    },
    'map': {
      vtype: 'map',
      desc: {
        zh: 'map型参数'
      },
      options: {
        requiredKey: {
          required: true,
          desc: {
            zh: '必须字段'
          }
        },
        optionKey: {
          vtype: 'number',
          desc: {
            zh: '数字类型字段'
          }
        }
      }
    },
    'map-array': {
      vtype: 'array',
      subType: 'map',
      desc: {
        zh: 'map数组型参数'
      },
      options: {
        requiredKey: {
          required: true,
          desc: {
            zh: '必须字段'
          }
        },
        optionKey: {
          vtype: 'number',
          desc: {
            zh: '数字类型字段'
          }
        }
      }
    }
  }
};
exports.run = function (argv) {
  console.log('===========');
  console.log('option-type run success');
  console.log(argv._parsedValue);
};