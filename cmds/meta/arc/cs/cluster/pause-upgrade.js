'use strict';

let { default: Client } = require(`@alicloud/cs20151215`);
let runtime = require('../../../../../lib/runtime.js');
let output = require('../../../../../lib/output.js');

exports.cmdObj = {
  desc: {
    zh: '暂停集群升级',
    en: `suspend the upgrade of a cluster.`
  },
  args: [
    {
      name: 'clusterId',
      required: true,
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

  let client = new Client(config);

  try {
    await client.pauseClusterUpgradeWithOptions(argv._[0], {}, runtime.getRuntimeOption(argv));
  } catch (e) {
    output.error(e.message);
  }
};