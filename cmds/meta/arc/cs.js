'use strict';

const Command = require('../../../lib/command');

const ClusterCommand = require('./cs/cluster');
const NodeCommand = require('./cs/node');
const AddonCommand = require('./cs/addon');
const NodePoolCommand = require('./cs/nodepool');

module.exports = class extends Command {
  constructor(name) {
    super(name, {
      desc: {
        zh: '容器服务K8S版',
        en: `Container Service for Kubernetes`
      }
    });

    this.registerCommand(new ClusterCommand('cluster'));
    this.registerCommand(new NodeCommand('node'));
    this.registerCommand(new AddonCommand('addon'));
    this.registerCommand(new NodePoolCommand('nodepool'));
  }

  async run(args) {
    await this.help();
  }
};
