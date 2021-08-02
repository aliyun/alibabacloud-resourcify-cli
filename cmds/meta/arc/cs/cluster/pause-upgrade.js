'use strict';

const { default: Client } = require(`@alicloud/cs20151215`);
const Command = require('../../../../../lib/command.js');
const { loadContext } = require('../../../../../lib/context.js');
const runtime = require('../../../../../lib/runtime.js');

module.exports = class extends Command {
  constructor(name) {
    super(name, {
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

    try {
      await client.pauseClusterUpgradeWithOptions(ctx.argv[0], {}, runtime.getRuntimeOption());
    } catch (e) {
      console.error(e.message);
    }
  }
};
