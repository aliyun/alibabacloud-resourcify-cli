'use strict';

const Command = require('../../../lib/command.js');
const Config = require('../../../lib/config.js');
const { loadContext } = require('../../../lib/context.js');

module.exports = class extends Command {
  constructor(name) {
    super(name, {
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
    });
  }

  async run(args) {
    const ctx = loadContext(args);
    const [key, value] = ctx.argv;
    if (typeof value === 'undefined') {
      delete ctx.profile[key];
    } else {
      ctx.profile[key] = value;
    }
    const config = new Config();
    config.updateProfile(ctx.profileName, ctx.profile);
  }
};
