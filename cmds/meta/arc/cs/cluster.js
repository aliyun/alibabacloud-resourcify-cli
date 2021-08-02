'use strict';

const Command = require('../../../../lib/command');

const CreateKubernetesCommand = require('./cluster/create-kubernetes');
const CreateManagedCommand = require('./cluster/create-managed');
const CreateASKCommand = require('./cluster/create-ask');
const CreateEdgeCommand = require('./cluster/create-edge');
const DeleteCommand = require('./cluster/delete');
const GetCommand = require('./cluster/get');
const GetUserQuotaCommand = require('./cluster/get-userquota');
const ListCommand = require('./cluster/list');
const UpdateCommand = require('./cluster/update');
const GetAgentCommand = require('./cluster/get-agent');
const GetKubeconfigCommand = require('./cluster/get-kubeconfig');
const GetLogCommand = require('./cluster/get-log');
const ListResourceCommand = require('./cluster/list-resource');
const ListTagsCommand = require('./cluster/list-tags');
const ScaleoutCommand = require('./cluster/scaleout');
const UpdateTagCommand = require('./cluster/update-tag');
const GetUpdateStatusCommand = require('./cluster/get-update-status');
const UpgradeCommand = require('./cluster/upgrade');
const CancelUpgradeCommand = require('./cluster/cancel-upgrade');
const PauseUpgradeCommand = require('./cluster/pause-upgrade');
const RestartUpgradeCommand = require('./cluster/restart-upgrade');

module.exports = class extends Command {
  constructor(name) {
    super(name, {
      desc: {
        zh: '集群相关操作',
        en: `Action of container service cluster`
      }
    });

    this.registerCommand(new CreateKubernetesCommand('create-kubernetes'));
    this.registerCommand(new CreateManagedCommand('create-managed'));
    this.registerCommand(new CreateASKCommand('create-ask'));
    this.registerCommand(new CreateEdgeCommand('create-edge'));
    this.registerCommand(new DeleteCommand('delete'));
    this.registerCommand(new GetCommand('get'));
    this.registerCommand(new GetUserQuotaCommand('get-userquota'));
    this.registerCommand(new ListCommand('list'));
    this.registerCommand(new UpdateCommand('update'));
    this.registerCommand(new GetAgentCommand('get-agent'));
    this.registerCommand(new GetKubeconfigCommand('get-kubeconfig'));
    this.registerCommand(new GetLogCommand('get-log'));
    this.registerCommand(new ListResourceCommand('list-resource'));
    this.registerCommand(new ListTagsCommand('list-tags'));
    this.registerCommand(new ScaleoutCommand('scaleout'));
    this.registerCommand(new UpdateTagCommand('update-tag'));
    this.registerCommand(new GetUpdateStatusCommand('get-update-status'));
    this.registerCommand(new UpgradeCommand('upgrade'));
    this.registerCommand(new CancelUpgradeCommand('cancel-upgrade'));
    this.registerCommand(new PauseUpgradeCommand('pause-upgrade'));
    this.registerCommand(new RestartUpgradeCommand('restart-upgrade'));
  }

  async run(args) {
    await this.help();
  }
};
