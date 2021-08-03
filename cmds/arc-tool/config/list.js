'use strict';

const Config = require('../../../lib/config.js');
const Command = require('../../../lib/command');

module.exports = class extends Command {
  constructor(name) {
    super(name, {
      desc: {
        zh: '列举指定配置所有信息，未指定则返回默认',
        en: `List all the information of the specified configuration, return to the default if not specified`
      }
    });
  }

  async run(args) {
    const config = new Config();
    const conf = config.getConfig();
    if (!conf) {
      console.error('No configuration currently exists');
      return;
    }

    console.log(JSON.stringify(conf, null, 2));
  }
};
