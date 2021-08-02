'use strict';
let { default: Client } = require('@alicloud/cs20151215');
let runtime = require('../../../../../lib/runtime.js');
let output = require('../../../../../lib/output.js');

exports.cmdObj={
  desc: {
    zh: '',
    en: ''
  },
  
  args: [{
    name: 'workflowName',
    required: true
  },
  ],
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
    result = await client.descirbeWorkflowWithOptions(ctx.argv[0], {}, runtime.getRuntimeOption());
  } catch (e) {
    output.error(e.message);
  }
  let data = JSON.stringify(result, null, 2);
  output.log(data);
};