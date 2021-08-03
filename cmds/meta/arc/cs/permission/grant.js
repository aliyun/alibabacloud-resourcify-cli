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
      mappingType: require('@alicloud/cs20151215').GrantPermissionsRequestBody,
      options: {
        'cluster':{
          mapping: 'cluster',
          required: false,
          vtype: 'string',
          desc: {
            zh: '',
            en: ''
          }
        },
        'is-custom':{
          mapping: 'isCustom',
          required: false,
          vtype: 'boolean',
          desc: {
            zh: '',
            en: ''
          }
        },
        'role-name':{
          mapping: 'roleName',
          required: false,
          vtype: 'string',
          desc: {
            zh: '',
            en: ''
          }
        },
        'role-type':{
          mapping: 'roleType',
          required: false,
          vtype: 'string',
          desc: {
            zh: '',
            en: ''
          }
        },
        'namespace':{
          mapping: 'namespace',
          required: false,
          vtype: 'string',
          desc: {
            zh: '',
            en: ''
          }
        },
        'is-ram-role':{
          mapping: 'isRamRole',
          required: false,
          vtype: 'boolean',
          desc: {
            zh: '',
            en: ''
          }
        },},

    },},
  args: [{
    name: 'uid',
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
  let GrantPermissionsRequest = require('@alicloud/cs20151215').GrantPermissionsRequest;
  let request = new GrantPermissionsRequest(ctx.mappingValue);  
  let client = new Client(config);
  let result;
  try {
    result = await client.grantPermissionsWithOptions(ctx.argv[0], request, {}, runtime.getRuntimeOption());
  } catch (e) {
    output.error(e.message);
  }

  if (result) {
    result = result.body;
  }

  let data = JSON.stringify(result, null, 2);
  output.log(data);
};