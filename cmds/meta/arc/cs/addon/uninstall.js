'use strict';

const { default: Client } = require(`@alicloud/cs20151215`);
const runtime = require('../../../../../lib/runtime.js');

exports.cmdObj = {
  desc: {
    zh: '卸载集群插件',
    en: `uninstall an add-on from a cluster.`
  },
  options: {
    'addons': {
      mapping: 'UnInstallClusterAddonsRequest.addons',
      vtype: 'array',
      subType: 'map',
      desc: {
        zh: 'Addon列表',
        en: `the list of add-on`
      },
      options: {
        'name': {
          mapping:'name',
          required: true,
          desc: {
            zh: '集群名称',
            en: `The name of the cluster.`
          }
        }
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
  const profile = await runtime.getConfigOption(ctx.profile);
  const { Config } = require('@alicloud/openapi-client');
  const config = new Config({
    accessKeyId: profile.access_key_id,
    accessKeySecret: profile.access_key_secret,
    securityToken: profile.sts_token,
    regionId: profile.region,
    type: profile.type
  });
  const UnInstallClusterAddonsRequest = require(`@alicloud/cs20151215`).UnInstallClusterAddonsRequest;
  const request = new UnInstallClusterAddonsRequest(ctx.mappingValue.UnInstallClusterAddonsRequest);

  const client = new Client(config);

  try {
    await client.unInstallClusterAddonsWithOptions(ctx.argv[0], request, {}, runtime.getRuntimeOption());
  } catch (e) {
    console.error(e.message);
  }

};