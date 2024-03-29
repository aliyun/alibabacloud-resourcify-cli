'use strict';

const { default: Client } = require(`@alicloud/cs20151215`);
const Action = require('../../../../lib/action.js');
const runtime = require('../../../../lib/runtime.js');

module.exports = class extends Action {
  constructor(name) {
    super(name, {
      desc: {
        zh: '集群安装的Addons详情',
        en: ` query details about the add-ons that are supported by a specified cluster type.`
      },
      options: {
        'region': {
          mapping: 'DescribeAddonsRequest.region',
          vtype: 'string',
          desc: {
            zh: '阿里云区域',
            en: `The ID of the region to query.`
          }
        },
        'cluster-type': {
          mapping: 'DescribeAddonsRequest.clusterType',
          desc: {
            zh: '集群类型，默认为kubernetes',
            en: `The type of the cluster. Default value: kubernetes.`
          }
        }
      }
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
    const DescribeAddonsRequest = require(`@alicloud/cs20151215`).DescribeAddonsRequest;
    const request = new DescribeAddonsRequest(ctx.mappingValue.DescribeAddonsRequest);

    const client = new Client(config);
    let result = await client.describeAddonsWithOptions(request, {}, runtime.getRuntimeOption());
    if (result) {
      result = result.body;
    }
    const data = JSON.stringify(result, null, 2);
    console.log(data);
  }
};
