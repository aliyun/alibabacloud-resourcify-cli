'use strict';

let { default: Client } = require(`@alicloud/cs20151215`);
let runtime = require('../../../../../lib/runtime.js');
let output = require('../../../../../lib/output.js');

exports.cmdObj = {
  desc: {
    zh: '列举集群节点信息',
    en: `query nodes in a cluster.`
  },
  options: {
    'instance-ids': {
      mapping: 'DescribeClusterNodesRequest.instanceIds',
      vtype: 'array',
      subType: 'string',
      desc: {
        zh: '节点实例ID，按照实例ID进行过滤',
        // TODO
        en: ``
      },
      attributes: {
        show: [
          {
            'nodepool-id': {
              type: 'equal',
              value: undefined
            }
          }
        ]
      }
    },
    'page-size': {
      mapping: 'DescribeClusterNodesRequest.pageSize',
      desc: {
        zh: '分页大小',
        en: `The number of entries to return on each page.`
      }
    },
    'page-number': {
      mapping: 'DescribeClusterNodesRequest.pageNumber',
      desc: {
        zh: '共计展示多少页',
        en: `The total number of pages to return.`
      }
    },
    'nodepool-id': {
      mapping: 'DescribeClusterNodesRequest.nodepoolId',
      vtype: 'string',
      desc: {
        zh: '节点池ID',
        en: `The ID of the node pool.`
      }
    },
    'state': {
      mapping: 'DescribeClusterNodesRequest.state',
      desc: {
        zh: '状态信息',
        en: `The status of the cluster.`
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
  let DescribeClusterNodesRequest = require(`@alicloud/cs20151215`).DescribeClusterNodesRequest;
  let request = new DescribeClusterNodesRequest(ctx.mappingValue.DescribeClusterNodesRequest);

  let client = new Client(config);
  let result;
  try {
    result = await client.describeClusterNodesWithOptions(ctx.argv[0], request, {}, runtime.getRuntimeOption());
  } catch (e) {
    output.error(e.message);
  }
  if (result) {
    result = result.body;
  }
  let data = JSON.stringify(result, null, 2);
  output.log(data);
};