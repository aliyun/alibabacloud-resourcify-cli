'use strict';

const Command = require('../../../lib/command');

const ListCommand = require('./addon/list');
const GetCommand = require('./addon/get');
const GetUpgradeStatusCommand = require('./addon/get-upgrade-status');
const InstallCommand = require('./addon/install');
const UninstallCommand = require('./addon/uninstall');

module.exports = class extends Command {
  constructor(name) {
    super(name, {
      desc: {
        zh: '集群插件操作',
        en: `Action of container service cluster addon-on`
      }
    });

    this.registerCommand(new ListCommand('list'));
    this.registerCommand(new GetCommand('get'));
    this.registerCommand(new GetUpgradeStatusCommand('get-upgrade-status'));
    this.registerCommand(new InstallCommand('install'));
    this.registerCommand(new UninstallCommand('uninstall'));
  }

  async run(args) {
    await this.help();
  }
};
