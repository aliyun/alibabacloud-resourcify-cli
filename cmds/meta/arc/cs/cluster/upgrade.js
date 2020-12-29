'use strict';

let { default: Client } = require(`@alicloud/cs20151215`);
let runtime = require('../../../../../lib/runtime.js');
let output = require('../../../../../lib/output.js');

exports.cmdObj = {
  desc: {
    zh: '升级指定用户集群版本',
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
};

exports.run = async function (ctx) {
  let profile = await runtime.getConfigOption(ctx.profile);
  let { Config } = require('@alicloud/openapi-client');
  let config = new Config({
    accessKeyId: profile.access_key_id,
    accessKeySecret: profile.access_key_secret,
    securityToken: profile.sts_token,
    regionId: profile.region,
    type: profile.type
  });
  let UpgradeClusterRequest = require(`@alicloud/cs20151215`).UpgradeClusterRequest;
  let request = new UpgradeClusterRequest(ctx.mappingValue.UpgradeClusterRequest);

  let client = new Client(config);
  try {
    await client.upgradeClusterWithOptions(ctx.argv[0], request, {}, runtime.getRuntimeOption());
  } catch (e) {
    output.error(e.message);
  }
};