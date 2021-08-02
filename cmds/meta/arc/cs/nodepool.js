'use strict';

const Command = require('../../../../lib/command');

const CreateCommand = require('./nodepool/create');
const DeleteCommand = require('./nodepool/delete');
const GetCommand = require('./nodepool/get');
const ListCommand = require('./nodepool/list');
const ScaleoutCommand = require('./nodepool/scaleout');
const UpdateCommand = require('./nodepool/update');

module.exports = class extends Command {
  constructor(name) {
    super(name, {
      desc: {
        zh: '集群节点池操作',
        en: `cluster node pool operations`
      }
    });

    this.registerCommand(new CreateCommand('create'));
    this.registerCommand(new DeleteCommand('delete'));
    this.registerCommand(new GetCommand('get'));
    this.registerCommand(new ListCommand('list'));
    this.registerCommand(new ScaleoutCommand('scaleout'));
    this.registerCommand(new UpdateCommand('update'));
  }

  async run(args) {
    await this.help();
  }
};
