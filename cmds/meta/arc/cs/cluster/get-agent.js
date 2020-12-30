'use strict';

let { default: Client } = require(`@alicloud/cs20151215`);
let runtime = require('../../../../../lib/runtime.js');
let output = require('../../../../../lib/output.js');

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
  let DescribeExternalAgentRequest = require(`@alicloud/cs20151215`).DescribeExternalAgentRequest;
  let request = new DescribeExternalAgentRequest(ctx.mappingValue.DescribeExternalAgentRequest);
  try {
    result = await client.describeExternalAgentWithOptions(ctx.argv[0], request, {}, runtime.getRuntimeOption());
  } catch (e) {
    output.error(e.message);
  }
  if (result) {
    result = result.body;
  }
  let data = JSON.stringify(result, null, 2);
  output.log(data);
};