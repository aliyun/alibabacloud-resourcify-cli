'use strict';

const { default: Client } = require(`@alicloud/cs20151215`);
const runtime = require('../../../../../lib/runtime.js');

exports.cmdObj = {
  desc: {
    zh: '获取注册集群的代理配置。您可以将改配置部署到自己的集群用于访问API Server',
    en: `obtain an agent to access the API server.`
  },
  options: {
    'private-ip-address': {
      mapping: 'DescribeExternalAgentRequest.privateIpAddress',
      vtype: 'string',
      default: 'false',
      desc: {
        zh: '是否获取内网访问凭据',
        en: `Whether to obtain internal network access credentials`
      },
      choices: [
        'false',
        'true'
      ]
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

  const client = new Client(config);
  let result;
  const DescribeExternalAgentRequest = require(`@alicloud/cs20151215`).DescribeExternalAgentRequest;
  const request = new DescribeExternalAgentRequest(ctx.mappingValue.DescribeExternalAgentRequest);
  try {
    result = await client.describeExternalAgentWithOptions(ctx.argv[0], request, {}, runtime.getRuntimeOption());
  } catch (e) {
    console.error(e.message);
  }
  if (result) {
    result = result.body;
  }
  const data = JSON.stringify(result, null, 2);
  console.log(data);
};