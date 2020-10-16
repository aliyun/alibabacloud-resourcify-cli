'use strict';

let { default: Client } = require(`@alicloud/cs20151215`);
let runtime = require('../../../../../runtime.js');
let output = require('../../../../../output.js');

exports.cmdObj = {
  use: 'arc cs node list',
  desc: {
    zh: '列举集群节点信息',
    en: `query nodes in a cluster.`
  },
  options: {
    'page-size': {
      mapping: 'pageSize',
      desc: {
        zh: '分页大小',
        en: `The number of entries to return on each page.`
      }
    },
    'page-number': {
      mapping: 'pageNumber',
      desc: {
        zh: '共计展示多少页',
        en: `The total number of pages to return.`
      }
    },
    'nodepool-id': {
      mapping: 'nodepoolId',
      desc: {
        zh: '节点池ID',
        en: `The ID of the node pool.`
      }
    },
    'state': {
      mapping: 'state',
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
  let DescribeClusterNodesRequest = require(`@alicloud/cs20151215`).DescribeClusterNodesRequest;
  let request = new DescribeClusterNodesRequest(argv._mappingValue);

  let client = new Client(config);
  let result;
  try {
    result = await client.describeClusterNodesWithOptions(argv._[0], request, {}, runtime.getRuntimeOption(argv));
  } catch (e) {
    output.error(e.message);
  }
  if (result) {
    result = result.body;
  }
  let data = JSON.stringify(result, null, 2);
  output.log(data);
};