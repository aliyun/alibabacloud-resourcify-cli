'use strict';
let { default: Client } = require('@alicloud/cs20151215');
let runtime = require('../../../../../lib/runtime.js');
let output = require('../../../../../lib/output.js');

exports.cmdObj={
  desc: {
    zh: '',
    en: ''
  },
  options: {
    'region':{
      mapping: 'region',
      required: false,
      vtype: 'string',
      desc: {
        zh: '',
        en: ''
      }
    },
    'cluster-type':{
      mapping: 'clusterType',
      required: false,
      vtype: 'string',
      desc: {
        zh: '',
        en: ''
      }
    },
    'kubernetes-version':{
      mapping: 'kubernetesVersion',
      required: false,
      vtype: 'string',
      desc: {
        zh: '',
        en: ''
      }
    },
    'profile':{
      mapping: 'profile',
      required: false,
      vtype: 'string',
      desc: {
        zh: '',
        en: ''
      }
    },},
  args: [],
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
  let DescribeKubernetesVersionMetadataRequest = require('@alicloud/cs20151215').DescribeKubernetesVersionMetadataRequest;
  let request = new DescribeKubernetesVersionMetadataRequest(ctx.mappingValue);  
  let client = new Client(config);
  let result;
  try {
    result = await client.describeKubernetesVersionMetadataWithOptions(request, {}, runtime.getRuntimeOption());
  } catch (e) {
    output.error(e.message);
  }
  let data = JSON.stringify(result, null, 2);
  output.log(data);
};