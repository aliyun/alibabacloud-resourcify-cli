'use strict';

const { default: Client } = require(`@alicloud/cs20151215`);
const Action = require('../../../../lib/action.js');

const runtime = require('../../../../lib/runtime.js');

module.exports = class extends Action {
  constructor(name) {
    super(name, {
      desc: {
        en: 'Delete the cluster node pool',
        zh: '删除节点池'
      },
      options: {

      },
      args: [
        {
          name: 'clusterId',
          required: true,
          vtype: 'string',
          desc: {
            zh: '容器实例Id',
            en: ''
          }
        },
        {
          name: 'nodepoolId',
          required: true,
          vtype: 'string',
          desc: {
            zh: '节点池Id',
            en: ''
          }
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

    const client = new Client(config);
    let result = await client.deleteClusterNodepoolWithOptions(ctx.argv[0], ctx.argv[1], {}, runtime.getRuntimeOption());

    if (result) {
      result = result.body;
    }
    const data = JSON.stringify(result, null, 2);
    console.log(data);
  }
};
