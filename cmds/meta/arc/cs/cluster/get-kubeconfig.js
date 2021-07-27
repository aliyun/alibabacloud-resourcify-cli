'use strict';

const { default: Client } = require(`@alicloud/cs20151215`);
const runtime = require('../../../../../lib/runtime.js');

exports.cmdObj = {
  desc: {
    zh: '返回包含当前登录用户身份信息的Kubernetes集群访问kubeconfig',
    en: `Return to the Kubernetes cluster containing the identity information of the currently logged in user to access kubeconfig`
  },
  options: {
    'private-ip-address': {
      mapping: 'DescribeClusterUserKubeconfigRequest.privateIpAddress',
      vtype: 'boolean',
      desc: {
        zh: '当前用户对应的集群访问kubeconfig',
        en: `The cluster corresponding to the current user accesses kubeconfig`
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
  const DescribeClusterUserKubeconfigRequest = require(`@alicloud/cs20151215`).DescribeClusterUserKubeconfigRequest;
  const request = new DescribeClusterUserKubeconfigRequest(ctx.mappingValue.DescribeClusterUserKubeconfigRequest);
  const client = new Client(config);
  let result;
  try {
    result = await client.describeClusterUserKubeconfigWithOptions(ctx.argv[0], request, {}, runtime.getRuntimeOption());
  } catch (e) {
    console.error(e.message);
  }
  if (result) {
    result = result.body;
  }
  const data = JSON.stringify(result, null, 2);
  console.log(data);
};