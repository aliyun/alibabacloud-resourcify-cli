'use strict';

const Command = require('../lib/command');

const ConfigCommand = require('./arc-tool/config');
const ServeCommand = require('./arc-tool/serve');
const CompletionCommand = require('./arc-tool/completion');
const VersionCommand = require('./arc-tool/version');

module.exports = class extends Command {
  constructor(name) {
    super(name, {
      desc: {
        zh: '阿里云资源化命令行工具，用于配置、自动补全等辅助设置',
        en: 'Alibaba Cloud Resourcify CLI, used for settings, such as configuation, autocomplation, etc'
      },
      sub: {
        completion: {
          zh: '自动补全',
          en: `Autocomplete`
        }
      }
    });

    this.registerCommand(new ConfigCommand('config'));
    this.registerCommand(new CompletionCommand('completion'));
    this.registerCommand(new ServeCommand('serve'));
    this.registerCommand(new VersionCommand('version'));
  }

  async run(args) {
    await this.help();
  }
};
