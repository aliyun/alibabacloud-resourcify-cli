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
    'description':{
      mapping: 'description',
      required: false,
      vtype: 'string',
      desc: {
        zh: '',
        en: ''
      }
    },
    'name':{
      mapping: 'name',
      required: false,
      vtype: 'string',
      desc: {
        zh: '',
        en: ''
      }
    },
    'tags':{
      mapping: 'tags',
      required: false,
      vtype: 'string',
      desc: {
        zh: '',
        en: ''
      }
    },
    'template':{
      mapping: 'template',
      required: false,
      vtype: 'string',
      desc: {
        zh: '',
        en: ''
      }
    },
    'template-type':{
      mapping: 'templateType',
      required: false,
      vtype: 'string',
      desc: {
        zh: '',
        en: ''
      }
    },},
  args: [{
    name: 'TemplateId',
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
  let UpdateTemplateRequest = require('@alicloud/cs20151215').UpdateTemplateRequest;
  let request = new UpdateTemplateRequest(ctx.mappingValue);  
  let client = new Client(config);
  let result;
  try {
    result = await client.updateTemplateWithOptions(ctx.argv[0], request, {}, runtime.getRuntimeOption());
  } catch (e) {
    output.error(e.message);
  }
  let data = JSON.stringify(result, null, 2);
  output.log(data);
};