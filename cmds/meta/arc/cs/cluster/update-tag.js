'use strict';

let { default: Client } = require(`@alicloud/cs20151215`);
let runtime = require('../../../../../lib/runtime.js');
let output = require('../../../../../lib/output.js');

exports.cmdObj = {
  desc: {
    zh: '修改当前Kubernetes集群的tag接口',
    en: `modify the tags of a cluster.`
  },
  options: {
    'body': {
      mapping: 'ModifyClusterTagsRequest.body',
      vtype: 'array',
      subType: 'map',
      desc: {
        zh: '集群标签列表',
        en: 'Cluster tag list'
      },
      options: {
        key: {
          required: true,
          mapping: 'key',
          desc: {
            zh: '标签名称',
            en: `The name of the tag to be modified.`
          }
        },
        value: {
          required: true,
          mapping: 'value',
          desc: {
            zh: '标签值',
            en: `The value of the tag to be modified.`
          }
        }
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
  let profile = await runtime.getConfigOption(ctx.profile);
  let { Config } = require('@alicloud/openapi-client');
  let config = new Config({
    accessKeyId: profile.access_key_id,
    accessKeySecret: profile.access_key_secret,
    securityToken: profile.sts_token,
    regionId: profile.region,
    type: profile.type
  });
  let ModifyClusterTagsRequest = require(`@alicloud/cs20151215`).ModifyClusterTagsRequest;
  let request = new ModifyClusterTagsRequest(ctx.mappingValue.ModifyClusterTagsRequest);

  let client = new Client(config);
  try {
    await client.modifyClusterTagsWithOptions(ctx.argv[0], request, {}, runtime.getRuntimeOption());
  } catch (e) {
    output.error(e.message);
  }
};