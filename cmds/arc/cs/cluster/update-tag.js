'use strict';

const { default: Client } = require(`@alicloud/cs20151215`);
const Command = require('../../../../lib/command.js');
const { loadContext } = require('../../../../lib/context.js');
const runtime = require('../../../../lib/runtime.js');

module.exports = class extends Command {
  constructor(name) {
    super(name, {
      desc: {
        zh: '修改集群tag信息',
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
    });
  }

  async run(args) {
    const ctx = loadContext(args);
    const profile = await runtime.getConfigOption(ctx.profile);
    const { Config } = require('@alicloud/openapi-client');
    const config = new Config({
      accessKeyId: profile.access_key_id,
      accessKeySecret: profile.access_key_secret,
      securityToken: profile.sts_token,
      regionId: profile.region,
      type: profile.type
    });
    const ModifyClusterTagsRequest = require(`@alicloud/cs20151215`).ModifyClusterTagsRequest;
    const request = new ModifyClusterTagsRequest(ctx.mappingValue.ModifyClusterTagsRequest);

    const client = new Client(config);
    try {
      await client.modifyClusterTagsWithOptions(ctx.argv[0], request, {}, runtime.getRuntimeOption());
    } catch (e) {
      console.error(e.message);
    }
  }
};