'use strict';

const Command = require('../../lib/command');

const ConfigCommand = require('./arc-tool/config');

module.exports = class extends Command {
  constructor(name) {
    super(name, {
      desc: {
        zh: '阿里云资源化命令行工具，用于配置、自动补全等辅助设置',
        en: 'Alibaba Cloud Resourcify CLI, used for settings, such as configuation, autocomplation, etc'
      },
      sub: {
        'config': {
          zh: '配置CLI',
          en: `Configure CLI`
        },
        completion: {
          zh: '自动补全',
          en: `Autocomplete`
        },
        serve: {
          zh: '启动帮助文档web服务器',
          en: `Start the help document web server`
        }
      }
    });

    this.registerCommand(new ConfigCommand('config'));
  }

  async run(args) {
    console.log(args);
    await this.help();
  }
};
