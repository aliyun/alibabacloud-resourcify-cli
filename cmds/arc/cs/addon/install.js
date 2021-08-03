'use strict';

const { default: Client } = require(`@alicloud/cs20151215`);
const Action = require('../../../../lib/action.js');
const runtime = require('../../../../lib/runtime.js');

module.exports = class extends Action {
  constructor(name) {
    super(name, {
      desc: {
        zh: '安装集群插件',
        en: `install an add-on for a cluster.`
      },
      options: {
        'body': {
          mapping: 'InstallClusterAddonsRequest.body',
          vtype: 'array',
          subType: 'map',
          desc: {
            zh: 'Addon列表',
            en: `the list of add-on`
          },
          options: {
            'name': {
              mapping: 'name',
              vtype: 'string',
              desc: {
                zh: 'addon名称',
                en: `The name of the add-on.`
              }
            },
            'version': {
              mapping: 'version',
              vtype: 'string',
              desc: {
                zh: '插件版本',
                en: `The version of the add-on.`
              }
            },
            'config': {
              mapping: 'config',
              vtype: 'string',
              desc: {
                zh: '配置信息',
                en: 'The configurations of the add-on.'
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

  async run(ctx) {
    const profile = await runtime.getConfigOption(ctx.profile);
    const { Config } = require('@alicloud/openapi-client');
    const config = new Config({
      accessKeyId: profile.access_key_id,
      accessKeySecret: profile.access_key_secret,
      securityToken: profile.sts_token,
      regionId: profile.region,
      type: profile.type
    });
    const InstallClusterAddonsRequest = require(`@alicloud/cs20151215`).InstallClusterAddonsRequest;
    const request = new InstallClusterAddonsRequest(ctx.mappingValue.InstallClusterAddonsRequest);
    const client = new Client(config);

    try {
      await client.installClusterAddonsWithOptions(ctx.argv[0], request, {}, runtime.getRuntimeOption());
    } catch (e) {
      console.error(e.message);
    }
  }
};