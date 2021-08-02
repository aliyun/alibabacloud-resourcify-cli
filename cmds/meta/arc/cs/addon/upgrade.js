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
    'body':{
      mapping: 'body',
      required: false,
      vtype: 'array',
      subType: 'map',
      mappingType: require('@alicloud/cs20151215').UpgradeClusterAddonsRequestBody,
      options: {
        'component-name':{
          mapping: 'componentName',
          required: false,
          vtype: 'string',
          desc: {
            zh: '',
            en: ''
          }
        },
        'next-version':{
          mapping: 'nextVersion',
          required: false,
          vtype: 'string',
          desc: {
            zh: '',
            en: ''
          }
        },
        'version':{
          mapping: 'version',
          required: false,
          vtype: 'string',
          desc: {
            zh: '',
            en: ''
          }
        },},

    },},
  args: [{
    name: 'ClusterId',
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
  let UpgradeClusterAddonsRequest = require('@alicloud/cs20151215').UpgradeClusterAddonsRequest;
  let request = new UpgradeClusterAddonsRequest(ctx.mappingValue);  
  let client = new Client(config);
  let result;
  try {
    result = await client.upgradeClusterAddonsWithOptions(ctx.argv[0], request, {}, runtime.getRuntimeOption());
  } catch (e) {
    output.error(e.message);
  }
  let data = JSON.stringify(result, null, 2);
  output.log(data);
};