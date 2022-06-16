'use strict';

const { default: Client } = require(`@alicloud/cs20151215`);
const Action = require('../../../../lib/action.js');

const runtime = require('../../../../lib/runtime.js');

module.exports = class extends Action {
  constructor(name) {
    super(name, {
      desc: {
        zh: '升级用户集群版本',
        en: `upgrade a cluster.`
      },
      options: {
        'component-name': {
          mapping: 'UpgradeClusterRequest.componentName',
          vtype: 'string',
          desc: {
            zh: '组件名称，升级集群时取值：k8s',
            en: `Component name, value when upgrading the cluster: k8s.`
          }
        },
        'version': {
          mapping: 'UpgradeClusterRequest.version',
          vtype: 'string',
          desc: {
            zh: '集群当前版本',
            en: `Current version of the cluster`
          }
        },
        'next-version': {
          mapping: 'UpgradeClusterRequest.nextVersion',
          vtype: 'string',
          desc: {
            zh: '集群可升级版本',
            en: `The target version of the upgrade.`
          }
        }
      },
      args: [
        {
          name: 'clusterId',
          required: true
        }
      ]
    });
  }

  async run(ctx) {

    const profile = await runtime.getConfigOption(ctx.profile);
    const { Config } = require('@alicloud/openapi-client');
    const config = new Config({
      accessKeyId: profile.access_key_id,
      accessKeySecret: profile.access_key_secret,
      securityToken: profile.sts_token,
      regionId: profile.region,
      type: profile.type
    });
    const UpgradeClusterRequest = require(`@alicloud/cs20151215`).UpgradeClusterRequest;
    const request = new UpgradeClusterRequest(ctx.mappingValue.UpgradeClusterRequest);

    const client = new Client(config);
    await client.upgradeClusterWithOptions(ctx.argv[0], request, {}, runtime.getRuntimeOption());
  }
};
