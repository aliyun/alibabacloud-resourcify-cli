'use strict';

const { default: Client } = require(`@alicloud/cs20151215`);
const Command = require('../../../../../lib/command.js');
const { loadContext } = require('../../../../../lib/context.js');
const runtime = require('../../../../../lib/runtime.js');

module.exports = class extends Command {
  constructor(name) {
    super(name, {
      desc: {
        zh: '查询集群节点',
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
    const DescribeClusterNodesRequest = require(`@alicloud/cs20151215`).DescribeClusterNodesRequest;
    const request = new DescribeClusterNodesRequest(ctx.mappingValue.DescribeClusterNodesRequest);

    const client = new Client(config);
    let result;
    try {
      result = await client.describeClusterNodesWithOptions(ctx.argv[0], request, {}, runtime.getRuntimeOption());
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
