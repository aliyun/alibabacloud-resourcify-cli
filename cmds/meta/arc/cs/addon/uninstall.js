'use strict';

let { default: Client } = require(`@alicloud/cs20151215`);
let runtime = require('../../../../../lib/runtime.js');
let output = require('../../../../../lib/output.js');

exports.cmdObj = {
  desc: {
    zh: '卸载集群插件',
    en: `uninstall an add-on from a cluster.`
  },
  options: {
    'addons': {
      mapping: 'addons',
      mappingType: require(`@alicloud/cs20151215`).UnInstallClusterAddonsRequestAddons,
      vtype: 'array',
      subType: 'map',
      desc: {
        zh: 'Addon列表',
        en: `the list of add-on`
      },
      options: {
        'name': {
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

exports.run = async function (argv) {
  let profile = await runtime.getConfigOption();
  let { Config } = require('@alicloud/openapi-client');
  let config = new Config({
    accessKeyId: profile.access_key_id,
    accessKeySecret: profile.access_key_secret,
    securityToken: profile.sts_token,
    regionId: profile.region,
    type: profile.type
  });
  let UnInstallClusterAddonsRequest = require(`@alicloud/cs20151215`).UnInstallClusterAddonsRequest;
  let request = new UnInstallClusterAddonsRequest(argv._mappingValue);

  let client = new Client(config);

  try {
    await client.unInstallClusterAddonsWithOptions(argv._[0], request, {}, runtime.getRuntimeOption(argv));
  } catch (e) {
    output.error(e.message);
  }

};