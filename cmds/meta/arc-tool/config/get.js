'use strict';

const Command = require("../../../../lib/command");
const { loadContext } = require("../../../../lib/context");

module.exports = class extends Command {
  constructor(name) {
    super(name, {
      usage: [
        'arc config get [--profile profileName]'
      ],
      desc: {
        zh: '获取指定配置信息',
        en: `Get the specified profile information`
      }
    });
  }

  async run(args) {
    const ctx = loadContext(args);
    const data = JSON.stringify(ctx.profile, null, 2);
    console.log(data);
  }
};
