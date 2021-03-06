'use strict';

let { default: Client } = require(`@alicloud/cs20151215`);
let runtime = require('../../../../../lib/runtime.js');
let output = require('../../../../../lib/output.js');

exports.cmdObj = {
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

  let DescribeClusterAddonsUpgradeStatusRequest = require(`@alicloud/cs20151215`).DescribeClusterAddonsUpgradeStatusRequest;
  let request = new DescribeClusterAddonsUpgradeStatusRequest(ctx.mappingValue.DescribeClusterAddonsUpgradeStatusRequest);

  let client = new Client(config);
  let result;
  try {
    result = await client.describeClusterAddonsUpgradeStatusWithOptions(ctx.argv[0], request, {}, runtime.getRuntimeOption());
  } catch (e) {
    output.error(e.message);
  }
  if (result) {
    result = result.body;
  }
  let data = JSON.stringify(result, null, 2);
  output.log(data);
};