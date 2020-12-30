'use strict';

let { default: Client } = require(`@alicloud/cs20151215`);
let runtime = require('../../../../../lib/runtime.js');
let output = require('../../../../../lib/output.js');

exports.cmdObj = {
  desc: {
    zh: '查询可见的资源标签关系',
    en: `query tags that are attached to resources.`
  },
  options: {
    'next-token': {
      mapping: 'ListTagResourcesRequest.nextToken',
      desc: {
        zh: '下一个查询开始的Token',
        en: `The token used to start the next query.`
      }
    },
    'resource-ids': {
      mapping: 'ListTagResourcesRequest.resourceIds',
      vtype: 'array',
      subType: 'string',
      desc: {
        zh: '要查询的集群ID列表',
        en: `The IDs of the resources to query.`
      }
    },
    tags: {
      mapping: 'ListTagResourcesRequest.tags',
      vtype: 'array',
      subType: 'map',
      desc: {
        zh: '给集群打tag标签：key：标签名称；value：标签值',
        en: `The list of tags to query. This list is a JSON string that contains a maximum of 20 key-value pairs.`
      },
      options: {
        key: {
          mapping: 'key',
          desc: {
            zh: '标签名称',
            en: `the name of the tag.`
          }
        },
        value: {
          mapping: 'value',
          desc: {
            zh: '标签值',
            en: `the value of the tag.`
          }
        }
      }
    },
  }
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
  let ListTagResourcesRequest = require(`@alicloud/cs20151215`).ListTagResourcesRequest;
  let request = new ListTagResourcesRequest(ctx.mappingValue.ListTagResourcesRequest);

  let client = new Client(config);
  let result;
  try {
    result = await client.listTagResourcesWithOptions(request, {}, runtime.getRuntimeOption());
  } catch (e) {
    output.error(e.message);
  }
  let data = JSON.stringify(result, null, 2);
  output.log(data);
};