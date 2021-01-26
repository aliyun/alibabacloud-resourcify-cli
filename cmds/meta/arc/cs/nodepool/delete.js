'use strict';

let { default: Client } = require(`@alicloud/cs20151215`);
let runtime = require('../../../../../lib/runtime.js');
let output = require('../../../../../lib/output.js');


exports.cmdObj = {
  desc: {
    en: 'Delete the cluster node pool',
    zh: '删除节点池'
  },
  options: {

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
  
  let client = new Client(config);
  let result;
  try {
    result = await client.deleteClusterNodepoolWithOptions(ctx.argv[0], ctx.argv[1], {}, runtime.getRuntimeOption());
  } catch (e) {
    output.error(e.message);
  }
  if (result) {
    result = result.body;
  }
  let data = JSON.stringify(result, null, 2);
  output.log(data);

};