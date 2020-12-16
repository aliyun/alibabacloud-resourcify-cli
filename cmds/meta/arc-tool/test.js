'use strict';
exports.cmdObj = {
  desc: {
    zh: '交互式配置CLI，根据提示输入参数值，完成后自动将现有配置作为默认配置',
    en: `Configure the CLI interactively, enter parameter values according to the prompts, and automatically use the existing configuration as the default configuration after completion`
  },
  options: {
    flag: {
      vtype: 'array',
      subType: 'map',
      desc: {
        zh: '',
        en: ''
      },
      options: {
        key: {
          vtype: 'string',
          desc: {
            zh: '',
            en: ''
          }
        },
        value: {
          vtype: 'string',
          desc: {
            zh: '',
            en: ''
          }
        }
      }
    },
    flag2: {
      vtype: 'string',
      desc: {
        zh: '',
        en: ''
      },
      attributes: {
        required: [
          {
            'flag[*].key': {
              type: 'include',
              value: 'example'
            }
          }
        ]
      }
    }

  }
};


exports.run = function (ctx) {
  console.log('hhh');
};