'use strict';

let { default: Client } = require(`@alicloud/cs20151215`);
let runtime = require('../../../../../runtime.js');
let output = require('../../../../../output.js');

exports.cmdObj = {
  desc: {
    zh: '集群安装的Addons详情',
    en: ` query details about the add-ons that are supported by a specified cluster type.`
  },
  options: {
    'region': {
      mapping: 'region',
      desc: {
        zh: '阿里云区域',
        en: `The ID of the region to query.`
      }
    },
    'cluster-type': {
      mapping: 'clusterType',
      desc: {
        zh: '集群类型，默认为kubernetes',
        en: `The type of the cluster. Default value: kubernetes.`
      }
    }
  }
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
  let DescribeAddonsRequest = require(`@alicloud/cs20151215`).DescribeAddonsRequest;
  let request = new DescribeAddonsRequest(argv._mappingValue);

  let client = new Client(config);
  let result;
  try {
    result = await client.describeAddonsWithOptions(request, {}, runtime.getRuntimeOption(argv));
  } catch (e) {
    output.error(e.message);
  }
  if (result) {
    result = result.body;
  }
  let data = JSON.stringify(result, null, 2);
  output.log(data);
};