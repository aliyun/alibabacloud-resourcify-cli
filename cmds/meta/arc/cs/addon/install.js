'use strict';

let { default: Client } = require(`@alicloud/cs20151215`);
let runtime = require('../../../../../lib/runtime.js');
let output = require('../../../../../lib/output.js');

exports.cmdObj = {
  desc: {
    zh: '安装集群插件',
    en: `install an add-on for a cluster.`
  },
  options: {
    'body': {
      mapping: 'body',
      mappingType: require(`@alicloud/cs20151215`).InstallClusterAddonsRequestBody,
      vtype: 'array',
      subType: 'map',
      desc: {
        zh: 'Addon列表',
        en: `the list of add-on`
      },
      options: {
        'name': {
          mapping: 'name',
          desc: {
            zh: 'addon名称',
            en: `The name of the add-on.`
          }
        },
        'version': {
          mapping: 'version',
          desc: {
            zh: '插件版本',
            en: `The version of the add-on.`
          }
        },
        'disabled': {
          mapping: 'disabled',
          vtype: 'boolean',
          desc: {
            zh: '是否禁止默认安装',
            en: `Specifies whether to disable automatic installation of the add-on.`
          }
        },
        'required': {
          mapping: 'required',
          desc: {
            zh: '是否默认安装',
            en: `Specifies whether to enable automatic installation of the add-on.`
          }
        },
        'config': {
          mapping: 'config',
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
};

exports.run = async function (argv) {
  let profile = await runtime.getConfigOption();
  let { Config } = require('@alicloud/openapi-client');
  let config = new Config({
    accessKeyId: profile.access_key_id,
    accessKeySecret: profile.access_key_secret,
    securityToken: profile.sts_token,
    regionId: profile.region,
    type: profile.type
  });
  let InstallClusterAddonsRequest = require(`@alicloud/cs20151215`).InstallClusterAddonsRequest;
  let request = new InstallClusterAddonsRequest(argv._mappingValue);

  let client = new Client(config);

  try {
    await client.installClusterAddonsWithOptions(argv._[0], request, {}, runtime.getRuntimeOption(argv));
  } catch (e) {
    output.error(e.message);
  }
};