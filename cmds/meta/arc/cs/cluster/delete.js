'use strict';

const { default: Client } = require(`@alicloud/cs20151215`);
const runtime = require('../../../../../lib/runtime.js');

exports.cmdObj = {
  desc: {
    zh: '根据集群ID删除集群',
    en: `delete the cluster of a specified ID and release all nodes in the cluster.`
  },
  options: {
    'retain-resources': {
      mapping: 'DeleteClusterRequest.retainResources',
      vtype: 'array',
      subType: 'string',
      desc: {
        zh: '资源名称',
        en: `Resoure name`
      },
      attributes: {
        show: [
          { 
            'retain-all-resources': {
              type: 'equal',
              value: false
            }
          }
        ]
      }
    },
    'keep-slb': {
      mapping: 'DeleteClusterRequest.keepSlb',
      vtype: 'boolean',
      default: false,
      desc: {
        zh: '是否保留SLB',
        en: 'Whether to keep SLB'
      }
    },
    'retain-all-resources': {
      mapping: 'DeleteClusterRequest.retainAllResources',
      vtype: 'boolean',
      default: false,
      desc: {
        zh: '是否保留所有资源',
        en: 'Whether to keep all resources'
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
  const profile = await runtime.getConfigOption(ctx.profile);
  const { Config } = require('@alicloud/openapi-client');
  const config = new Config({
    accessKeyId: profile.access_key_id,
    accessKeySecret: profile.access_key_secret,
    securityToken: profile.sts_token,
    regionId: profile.region,
    type: profile.type
  });
  const DeleteClusterRequest = require(`@alicloud/cs20151215`).DeleteClusterRequest;
  const request = new DeleteClusterRequest(ctx.mappingValue.DeleteClusterRequest);
  const client = new Client(config);
  try {
    await client.deleteClusterWithOptions(ctx.argv[0], request, {}, runtime.getRuntimeOption());
  } catch (e) {
    console.error(e);
  }
};
