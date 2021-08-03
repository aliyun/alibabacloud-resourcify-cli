'use strict';

const { default: Client } = require(`@alicloud/cs20151215`);
const Command = require('../../../../lib/command.js');
const { loadContext } = require('../../../../lib/context.js');
const runtime = require('../../../../lib/runtime.js');

module.exports = class extends Command {
  constructor(name) {
    super(name, {
      desc: {
        zh: '移除集群节点',
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
    const DeleteClusterNodesRequest = require(`@alicloud/cs20151215`).DeleteClusterNodesRequest;
    const request = new DeleteClusterNodesRequest(ctx.mappingValue.DeleteClusterNodesRequest);

    const client = new Client(config);
    try {
      await client.deleteClusterNodesWithOptions(ctx.argv[0], request, {}, runtime.getRuntimeOption());
    } catch (e) {
      console.error(e.message);
    }
  }
};
