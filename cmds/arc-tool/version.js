'use strict';

const Command = require('../../lib/command');

module.exports = class extends Command {
  constructor(name) {
    super(name, {
      desc: {
        zh: '获取当前程序版本',
        en: `Get the current program version`
      }
    });
  }

  async run(args) {
    const info = require('../../package.json');
    console.log(info.version);
  }
};
