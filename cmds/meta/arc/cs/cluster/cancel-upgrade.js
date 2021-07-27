'use strict';

const { default: Client } = require(`@alicloud/cs20151215`);
const runtime = require('../../../../../lib/runtime.js');

exports.cmdObj = {
  desc: {
    zh: '取消集群升级',
    en: `cancel the upgrade of a cluster.`
  },
  args: [
    {
      name: 'clusterId',
      required: true,
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
  const client = new Client(config);
  try {
    await client.cancelClusterUpgradeWithOptions(ctx.argv[0], {}, runtime.getRuntimeOption());
  } catch (e) {
    console.error(e.message);
  }
};