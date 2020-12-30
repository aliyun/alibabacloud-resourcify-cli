'use strict';

let { default: Client } = require(`@alicloud/cs20151215`);
let runtime = require('../../../../../lib/runtime.js');
let output = require('../../../../../lib/output.js');

exports.cmdObj = {
  desc: {
    zh: '移除指定集群额外节点',
    en: `remove nodes from a cluster.`
  },
  options: {
    'release-node': {
      mapping: 'DeleteClusterNodesRequest.releaseNode',
      vtype: 'boolean',
      desc: {
        zh: '是否同时释放ECS',
        en: `Specifies whether to release the Elastic Compute Service (ECS) instances when they are removed from the cluster.`
      }
    },
    'drain-node': {
      mapping: 'DeleteClusterNodesRequest.drainNode',
      vtype: 'boolean',
      desc: {
        zh: '是否排空节点上的Pod',
        en: `Specifies whether to remove all pods from the nodes that you want to remove.`
      }
    },
    nodes: {
      mapping: 'DeleteClusterNodesRequest.nodes',
      vtype: 'array',
      subType: 'string',
      desc: {
        zh: '要移除的node_name数组',
        en: `A list of the nodes that you want to remove.`
      }
    },
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
  let DeleteClusterNodesRequest = require(`@alicloud/cs20151215`).DeleteClusterNodesRequest;
  let request = new DeleteClusterNodesRequest(ctx.mappingValue.DeleteClusterNodesRequest);

  let client = new Client(config);
  try {
    await client.deleteClusterNodesWithOptions(ctx.argv[0], request, {}, runtime.getRuntimeOption());
  } catch (e) {
    output.error(e.message);
  }

};