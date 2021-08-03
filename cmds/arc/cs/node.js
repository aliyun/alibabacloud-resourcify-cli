'use strict';

const Command = require('../../../lib/command');

const ListCommand = require('./node/list');
const DeleteCommand = require('./node/delete');
const AttachCommand = require('./node/attach');
const AttachEdgeCommand = require('./node/attach-edge');
const GetAttachScriptCommand = require('./node/get-attach-script');

module.exports = class extends Command {
  constructor(name) {
    super(name, {
      desc: {
        zh: '集群节点操作',
        en: `Action of container service node`
      }
    });

    this.registerCommand(new ListCommand('list'));
    this.registerCommand(new DeleteCommand('delete'));
    this.registerCommand(new AttachCommand('attach'));
    this.registerCommand(new AttachEdgeCommand('attach-edge'));
    this.registerCommand(new GetAttachScriptCommand('get-attach-script'));
  }

  async run(args) {
    await this.help();
  }
};
