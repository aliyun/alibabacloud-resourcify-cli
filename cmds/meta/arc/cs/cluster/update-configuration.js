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
    'customize-config':{
      mapping: 'customizeConfig',
      required: false,
      vtype: 'array',
      subType: 'map',
      mappingType: require('@alicloud/cs20151215').undefinedCustomizeConfig,
      options: {
        'name':{
          mapping: 'name',
          required: false,
          vtype: 'string',
          desc: {
            zh: '',
            en: ''
          }
        },
        'configs':{
          mapping: 'configs',
          required: false,
          vtype: 'array',
          subType: 'map',
          mappingType: require('@alicloud/cs20151215').undefinedCustomizeConfigConfigs,
          options: {
            'key':{
              mapping: 'key',
              required: false,
              vtype: 'string',
              desc: {
                zh: '',
                en: ''
              }
            },
            'value':{
              mapping: 'value',
              required: false,
              vtype: 'string',
              desc: {
                zh: '',
                en: ''
              }
            },},

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
  let ModifyClusterConfigurationRequest = require('@alicloud/cs20151215').ModifyClusterConfigurationRequest;
  let request = new ModifyClusterConfigurationRequest(ctx.mappingValue);  
  let client = new Client(config);
  let result;
  try {
    result = await client.modifyClusterConfigurationWithOptions(ctx.argv[0], request, {}, runtime.getRuntimeOption());
  } catch (e) {
    output.error(e.message);
  }
  let data = JSON.stringify(result, null, 2);
  output.log(data);
};