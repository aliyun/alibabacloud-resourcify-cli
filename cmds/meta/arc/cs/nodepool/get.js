'use strict';

const { default: Client } = require(`@alicloud/cs20151215`);
const runtime = require('../../../../../lib/runtime.js');


exports.cmdObj = {
  desc: {
    en: 'Describe the cluster node pool',
    zh: '查询集群指定节点池详情'
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
  const profile = await runtime.getConfigOption(ctx.profile);
  const { Config } = require('@alicloud/openapi-client');
  const config = new Config({
    accessKeyId: profile.access_key_id,
    accessKeySecret: profile.access_key_secret,
    securityToken: profile.sts_token,
    regionId: profile.region,
    type: profile.type
  });

  const client = new Client(config);
  let result;
  try {
    result = await client.describeClusterNodePoolDetailWithOptions(ctx.argv[0], ctx.argv[1], {}, runtime.getRuntimeOption());
  } catch (e) {
    console.error(e.message);
  }
  if (result) {
    result = result.body;
  }
  const data = JSON.stringify(result, null, 2);
  console.log(data);

};