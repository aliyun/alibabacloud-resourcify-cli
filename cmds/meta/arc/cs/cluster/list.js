'use strict';

let { default: Client } = require(`@alicloud/cs20151215`);
let runtime = require('../../../../../lib/runtime.js');
let output = require('../../../../../lib/output.js');
exports.cmdObj = {
  desc: {
    zh: '查看您在容器服务中创建的所有集群（包括Swarm和Kubernetes集群）',
    en: `View all the clusters you created in the container service (including Swarm and Kubernetes clusters)`
  },
  options: {
    name: {
      mapping: 'name',
      desc: {
        zh: '根据集群Name进行模糊匹配查询',
        en: `Fuzzy matching query based on cluster name`
      }
    },
    'cluster-type': {
      mapping: 'clusterType',
      desc: {
        zh: '集群类型',
        en: `Cluster type`
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
  let DescribeClustersRequest = require(`@alicloud/cs20151215`).DescribeClustersRequest;
  let request = new DescribeClustersRequest(argv._mappingValue);

  let client = new Client(config);
  let result;
  try {
    result = await client.describeClustersWithOptions(request, {}, runtime.getRuntimeOption(argv));
  } catch (e) {
    output.error(e.message);
  }
  if (result) {
    result = result.body;
  }
  let data = JSON.stringify(result, null, 2);
  output.log(data);
};