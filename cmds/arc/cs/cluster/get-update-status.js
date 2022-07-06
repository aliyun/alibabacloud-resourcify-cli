'use strict';

const { default: Client } = require(`@alicloud/cs20151215`);
const Action = require('../../../../lib/action.js');

const runtime = require('../../../../lib/runtime.js');
const { loadContext } = require('../../../../lib/context.js');

module.exports = class extends Action {
  constructor(name) {
    super(name, {
      desc: {
        zh: '查询集群升级状态',
        en: ` query the upgrade status of a cluster.`
      },
      args: [
        {
          name: 'clusterId',
          required: true,
        }
      ]
    });
  }

  async run(args) {
    const ctx = loadContext(args);
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
    let result = await client.getUpgradeStatusWithOptions(ctx.argv[0], {}, runtime.getRuntimeOption());

    if (result) {
      result = result.body;
    }
    const data = JSON.stringify(result, null, 2);
    console.log(data);
  }
};
