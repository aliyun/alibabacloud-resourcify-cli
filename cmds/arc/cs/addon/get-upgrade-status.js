'use strict';

const { default: Client } = require(`@alicloud/cs20151215`);
const Action = require('../../../../lib/action.js');
const runtime = require('../../../../lib/runtime.js');

module.exports = class extends Action {
  constructor(name) {
    super(name, {
      desc: {
        zh: '查询集群Addons升级状态',
        en: `query the upgrade status of a cluster add-on.`
      },
      options: {
        'component-ids': {
          required: true,
          mapping: 'DescribeClusterAddonsUpgradeStatusRequest.componentIds',
          vtype: 'array',
          subType: 'string',
          desc: {
            zh: '组件名称',
            en: ''
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

    const DescribeClusterAddonsUpgradeStatusRequest = require(`@alicloud/cs20151215`).DescribeClusterAddonsUpgradeStatusRequest;
    const request = new DescribeClusterAddonsUpgradeStatusRequest(ctx.mappingValue.DescribeClusterAddonsUpgradeStatusRequest);

    const client = new Client(config);
    let result;
    try {
      result = await client.describeClusterAddonsUpgradeStatusWithOptions(ctx.argv[0], request, {}, runtime.getRuntimeOption());
    } catch (e) {
      console.error(e.message);
    }
    if (result) {
      result = result.body;
    }
    const data = JSON.stringify(result, null, 2);
    console.log(data);
  }
};
