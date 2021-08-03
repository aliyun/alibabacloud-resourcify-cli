'use strict';

const Command = require('../../../lib/command.js');
const Config = require('../../../lib/config.js');
const { loadContext } = require('../../../lib/context.js');

module.exports = class extends Command {
  constructor(name) {
    super(name, {
      desc: {
        zh: '删除配置',
        en: `remove profile`
      },
      args: [
        {
          name: 'profileName',
          required: true
        }
      ]
    });
  }

  async run(args) {
    const ctx = loadContext(args);
    this.validateOptions(ctx.parsed);
    const [ profileName ] = ctx.argv;
    if (!profileName) {
      console.error(`the profileName is required`);
      process.exit(1);
    }

    const config = new Config();
    config.delete(ctx.argv[0]);
  }
};
