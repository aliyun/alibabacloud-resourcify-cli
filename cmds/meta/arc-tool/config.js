'use strict';
const config = require('../../../lib/config.js');
exports.cmdObj = {
  desc: {
    zh: '交互式配置CLI，根据提示输入参数值，完成后自动将现有配置作为默认配置',
    en: `Configure the CLI interactively, enter parameter values according to the prompts, and automatically use the existing configuration as the default configuration after completion`
  },
  sub: {
    delete: {
      zh: '删除配置',
      en: `remove profile`
    },
    get: {
      zh: '获取配置指定字段值',
      en: `Get profile specified field value`
    },
    list: {
      zh: '获取指定配置所有信息',
      en: `Get all information of the specified configuration`
    },
    set: {
      zh: '设置配置字段值',
      en: `Set profile field value`
    }
  },
  options: {
    interaction: {
      vtype: 'boolean',
      unchanged: true,
      default: true,
    },
    'access-key-id': {
      required: true,
      desc: {
        zh: '凭证ID',
        en: `Access Key ID`
      }
    },
    'access-key-secret': {
      required: true,
      desc: {
        zh: '凭证密钥',
        en: `Access Key Secret`
      }
    },
    'region': {
      desc: {
        zh: '阿里云区域',
        en: `the ID of the region`
      }
    },
    'language': {
      desc: {
        zh: 'CLI语言',
        en: `the language of CLI`
      },
      choices: [
        'zh',
        'en'
      ]
    }
  }
};

function confusePwd(pwd) {
  if (!pwd) {
    return;
  }

  return pwd.substr(0, 3) + '****' + pwd.substr(-4);
}

exports.preInteractive = function (ctx) {
  exports.cmdObj.options['access-key-id'].default = ctx.profile.access_key_id;
  exports.cmdObj.options['access-key-secret'].default = confusePwd(ctx.profile.access_key_secret);
  exports.cmdObj.options['access-key-secret'].filter = function (val) {
    if (val === confusePwd(ctx.profile.access_key_secret)) {
      return ctx.profile.access_key_secret;
    }
    return val;
  };
  exports.cmdObj.options.language.default = ctx.profile.language;
  exports.cmdObj.options.region.default = ctx.profile.region;
};

exports.run = function (ctx) {
  let profile = {};
  profile['access_key_id'] = ctx.parsedValue['access-key-id'];
  profile['access_key_secret'] = ctx.parsedValue['access-key-secret'];
  profile['region'] = ctx.parsedValue['region'] || ctx.profile.region;
  profile['language'] = ctx.parsedValue['language'] || ctx.profile.language;
  config.updateProfile(ctx.profileName, profile);
};