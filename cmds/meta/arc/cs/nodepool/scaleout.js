'use strict';

let { default: Client } = require(`@alicloud/cs20151215`);
let runtime = require('../../../../../lib/runtime.js');
let output = require('../../../../../lib/output.js');

exports.cmdObj = {
  desc: {
    en: 'Scaleout node pools',
    zh: '扩容节点池节点'
  },
  options: {
    'count': {
      mapping: 'ScaleClusterNodePoolRequest.count',
      vtype: 'number',
      desc: {
        en: '',
        zh: '扩容节点数量。受当前集群节点配额限制，单次操作最多扩容500个节点'
      }
    }
  },
  args: [
    {
      name: 'clusterId',
      required: true,
      vtype: 'string',
      desc: {
        zh: '容器实例Id',
        en: ''
      }
    },
    {
      name: 'nodepoolId',
      required: true,
      vtype: 'string',
      desc: {
        zh: '节点池Id',
        en: ''
      }
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
  let ScaleClusterNodePoolRequest = require(`@alicloud/cs20151215`).ScaleClusterNodePoolRequest;
  let request = new ScaleClusterNodePoolRequest(ctx.mappingValue.ScaleClusterNodePoolRequest);
  let client = new Client(config);
  let result;
  try {
    result = await client.scaleClusterNodePoolWithOptions(ctx.argv[0], ctx.argv[1], request, {}, runtime.getRuntimeOption());
  } catch (e) {
    output.error(e.message);
  }
  if (result) {
    result = result.body;
  }
  let data = JSON.stringify(result, null, 2);
  output.log(data);

};