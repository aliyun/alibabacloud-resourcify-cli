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
    'cluster-id':{
      mapping: 'clusterId',
      required: false,
      vtype: 'string',
      desc: {
        zh: '',
        en: ''
      }
    },
    'type':{
      mapping: 'type',
      required: false,
      vtype: 'string',
      desc: {
        zh: '',
        en: ''
      }
    },
    'page-size':{
      mapping: 'pageSize',
      required: false,
      vtype: 'long',
      desc: {
        zh: '',
        en: ''
      }
    },
    'page-number':{
      mapping: 'pageNumber',
      required: false,
      vtype: 'long',
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
  let DescribeEventsRequest = require('@alicloud/cs20151215').DescribeEventsRequest;
  let request = new DescribeEventsRequest(ctx.mappingValue);  
  let client = new Client(config);
  let result;
  try {
    result = await client.describeEventsWithOptions(request, {}, runtime.getRuntimeOption());
  } catch (e) {
    output.error(e.message);
  }
  let data = JSON.stringify(result, null, 2);
  output.log(data);
};