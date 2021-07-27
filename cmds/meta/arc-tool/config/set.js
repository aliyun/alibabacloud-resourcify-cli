'use strict';

const Config = require('../../../../lib/config.js');

exports.cmdObj = {
  desc: {
    zh: '设置配置中的字段，当字段不存在时添加；当value为空时，代表删除指定字段；若只是指定profile，则表示更改默认配置',
    en: `Set the field in the configuration, add it when the field does not exist; when the value is empty, it means delete the specified field; if only specify the profile, it means change the default configuration`
  },
  usage: [
    'arc config set [<key> <value>] [--profile profileName]'
  ],
  args: [
    {
      name: 'key',
    },
    {
      name: 'value',
    }
  ]
};

exports.validate = function (args) {
  if (args.argv[0] && args.argv[1] === undefined) {
    return 'value master be set';
  }
};

exports.run = function (ctx) {
  if (!ctx.argv[1]) {
    delete ctx.profile[ctx.argv[0]];
  } else {
    ctx.profile[ctx.argv[0]] = ctx.argv[1];
  }
  const config = new Config();
  config.updateProfile(ctx.profileName, ctx.profile);
};