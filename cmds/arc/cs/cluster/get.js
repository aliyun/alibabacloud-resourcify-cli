'use strict';

const { default: Client } = require(`@alicloud/cs20151215`);
const Action = require('../../../../lib/action.js');

const runtime = require('../../../../lib/runtime.js');

module.exports = class extends Action {
  constructor(name) {
    super(name, {
      short: {
        zh: '根据集群ID获取集群信息',
        en: 'view the details of a cluster by id'
      },
      desc: {
        zh: '根据集群ID，查看集群的详细信息',
        en: `view the details of a cluster based on the cluster ID.`
      },
      args: [
        {
          name: 'clusterId',
          required: true,
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
    const client = new Client(config);
    let result = await client.describeClusterDetailWithOptions(ctx.argv[0], {}, runtime.getRuntimeOption());

    if (result) {
      result = result.body;
    }
    const data = JSON.stringify(result, null, 2);
    console.log(data);
  }
};
