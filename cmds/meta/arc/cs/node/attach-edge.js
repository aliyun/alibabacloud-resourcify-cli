'use strict';

let { default: Client } = require(`@alicloud/cs20151215`);
let runtime = require('../../../../../runtime.js');
let output = require('../../../../../output.js');

exports.cmdObj = {
  desc: {
    zh: '添加已有ENS节点至边缘托管集群',
    en: `add existing Edge Node Service (ENS) instances to a managed edge cluster.`
  },
  options: {
    'is_edge_worker': {
      vtype: 'boolean',
      required: true,
      mapping: 'isEdgeWorker',
      desc: {
        zh: `是否为边缘节点。接入ENS节点时需要配置为true`,
        en: `Specifies whether to configure the worker node as an edge node. Set the value to true.`
      }
    },
    'instances': {
      mapping: 'instances',
      required: true,
      vtype: 'array',
      subType: 'string',
      desc: {
        zh: '实例列表',
        en: `A list of the ECS instances.`
      },
      options: {
        element: {
          required: true,
          desc: {
            zh: 'ECS实例ID',
            en: `ECS instance id`
          }
        }
      }
    },
    'rds-instances': {
      mapping: 'rdsInstances',
      vtype: 'array',
      subType: 'string',
      desc: {
        zh: 'RDS实例列表',
        en: `A list of the RDS instances.`
      },
      options: {
        element: {
          required: true,
          desc: {
            zh: 'RDS实例ID',
            en: `RDS instance id`
          }
        }
      }
    },
    'keep-instance-name': {
      mapping: 'keepInstanceName',
      vtype: 'boolean',
      desc: {
        zh: '是否保留实例名称',
        en: `Specifies whether to retain the names of the ECS instances.`
      }
    },
    'format-disk': {
      mapping: 'formatDisk',
      vtype: 'boolean',
      desc: {
        zh: '是否格式化数据盘',
        en: `Specifies whether to format the data disks of the ECS instances.`
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
  let AttachInstancesRequest = require(`@alicloud/cs20151215`).AttachInstancesRequest;
  let request = new AttachInstancesRequest(argv._mappingValue);

  let client = new Client(config);
  let result;
  try {
    result = await client.attachInstancesWithOptions(argv._[0], request, {}, runtime.getRuntimeOption(argv));
  } catch (e) {
    output.error(e.message);
  }
  if (result) {
    result = result.body;
  }
  let data = JSON.stringify(result, null, 2);
  output.log(data);
};