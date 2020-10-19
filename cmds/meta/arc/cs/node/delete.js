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
      mapping: 'releaseNode',
      vtype: 'boolean',
      desc: {
        zh: '是否同时释放ECS',
        en: `Specifies whether to release the Elastic Compute Service (ECS) instances when they are removed from the cluster.`
      }
    },
    'drain-node': {
      mapping: 'drainNode',
      vtype: 'boolean',
      desc: {
        zh: '是否排空节点上的Pod',
        en: `Specifies whether to remove all pods from the nodes that you want to remove.`
      }
    },
    nodes: {
      mapping: 'nodes',
      vtype: 'array',
      subType: 'string',
      desc: {
        zh: '要移除的node_name数组',
        en: `A list of the nodes that you want to remove.`
      },
      options: {
        element: {
          desc: {
            zh: '节点名称',
            en: `node name`
          }
        }
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
  let RemoveClusterNodesRequest = require(`@alicloud/cs20151215`).RemoveClusterNodesRequest;
  let request = new RemoveClusterNodesRequest(argv._mappingValue);

  let client = new Client(config);
  try {
    await client.removeClusterNodesWithOptions(argv._[0], request, {}, runtime.getRuntimeOption(argv));
  } catch (e) {
    output.error(e.message);
  }

};