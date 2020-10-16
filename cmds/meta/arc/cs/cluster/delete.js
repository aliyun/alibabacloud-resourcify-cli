'use strict';

let { default: Client } = require(`@alicloud/cs20151215`);
let runtime = require('../../../../../runtime.js');
let output = require('../../../../../output.js');

exports.cmdObj = {
  desc: {
    zh: '根据集群ID删除集群',
    en: `delete the cluster of a specified ID and release all nodes in the cluster.`
  },
  options: {
    'retain-resources': {
      mapping: 'retainResources',
      vtype: 'array',
      subType: 'string',
      desc: {
        zh: '资源名称',
        en: `Resoure name`
      },
      options: {
        element: {
          desc: {
            zh: '资源名称',
            en: `Resoure name`
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
  let DeleteClusterRequest = require(`@alicloud/cs20151215`).DeleteClusterRequest;
  let request = new DeleteClusterRequest(argv._mappingValue);
  let client = new Client(config);
  try {
    await client.deleteClusterWithOptions(argv._[0], request, {}, runtime.getRuntimeOption(argv));
  } catch (e) {
    output.error(e);
  }
};
