'use strict';

const { default: Client } = require(`@alicloud/cs20151215`);
const runtime = require('../../../../lib/runtime.js');

const Action = require('../../../../lib/action');

module.exports = class extends Action {
  constructor(name) {
    super(name, {
      short: {
        zh: '根据模糊查询获取集群信息',
        en: 'View all clusters'
      },
      desc: {
        zh: '查看您在容器服务中创建的所有集群（包括Swarm和Kubernetes集群）',
        en: `View all the clusters you created in the container service (including Swarm and Kubernetes clusters)`
      },
      options: {
        name: {
          mapping: 'DescribeClustersRequest.name',
          vtype: 'string',
          desc: {
            zh: '根据集群Name进行模糊匹配查询',
            en: `Fuzzy matching query based on cluster name`
          }
        },
        'cluster-type': {
          mapping: 'DescribeClustersRequest.clusterType',
          vtype: 'string',
          desc: {
            zh: '集群类型',
            en: `Cluster type`
          }
        },
        'page-size': {
          mapping: 'DescribeClustersRequest.pageSize',
          vtype: 'number',
          desc: {
            zh: '每页显示的记录数',
            en: `page size`
          }
        },
        'page-number': {
          mapping: 'DescribeClustersRequest.pageNumber',
          vtype: 'number',
          desc: {
            zh: '总页数',
            en: `page number`
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

    const DescribeClustersV1Request = require(`@alicloud/cs20151215`).DescribeClustersV1Request;
    const request = new DescribeClustersV1Request(ctx.mappingValue.DescribeClustersRequest);

    const client = new Client(config);
    let result = await client.describeClustersV1WithOptions(request, {}, runtime.getRuntimeOption());
    if (result) {
      result = result.body;
    }
    const data = JSON.stringify(result, null, 2);
    console.log(data);
  }
};
