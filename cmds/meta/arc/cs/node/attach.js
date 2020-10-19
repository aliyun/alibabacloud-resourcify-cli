'use strict';

let { default: Client } = require(`@alicloud/cs20151215`);
let runtime = require('../../../../../lib/runtime.js');
let output = require('../../../../../lib/output.js');

exports.cmdObj = {
  desc: {
    zh: '添加已有ECS节点到Kubernetes集群',
    en: `existing Elastic Compute Service (ECS) instances to a cluster.`
  },
  options: {
    'key-pair': {
      required: true,
      mapping: 'keyPair',
      desc: {
        zh: 'key-pair名称',
        en: `The name of the key pair. You must set key_pair or password.`
      },
      conflicts: [
        'password'
      ]
    },
    'password': {
      required: true,
      mapping: 'password',
      desc: {
        zh: '扩容的worker节点密码。密码规则为8~30 个字符，且同时包含三项（大、小写字母，数字和特殊符号）',
        en: `The password of the worker nodes to be added. The password must be 8 to 30 characters in length and contain three of the following character types: uppercase letters, lowercase letters, digits, and special characters. You must set key_pair or password.`
      },
      conflicts: [
        'key-pair'
      ]
    },
    'format-disk': {
      mapping: 'formatDisk',
      vtype: 'boolean',
      desc: {
        zh: '是否格式化数据盘',
        en: `Specifies whether to format the data disks of the ECS instances.`
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
    'cpu-policy': {
      mapping: 'cpuPolicy',
      desc: {
        zh: 'CPU策略。Kubernetes集群版本为1.12.6及以上版本支持static和none两种策略，默认为none。',
        en: `The CPU policy. For Kubernetes 1.12.6 and later, valid values of cpu_policy include static and none. Default value: none.`
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
    tags: {
      mapping: 'tags',
      vtype: 'array',
      subType: 'map',
      mappingType: require('@alicloud/cs20151215').AttachInstancesRequestTags,
      desc: {
        zh: '自定义节点标签',
        en: `The tags of the ECS instances.`
      },
      example: `key=tier,value=backend`,
      options: {
        key: {
          desc: {
            zh: '标签名称',
            en: `the name of tag`
          }
        },
        value: {
          desc: {
            zh: '标签值',
            en: `the value of tag`
          }
        }
      }
    },
    'runtime': {
      mapping: 'runtime',
      vtype: 'map',
      desc: {
        zh: '容器运行时，一般为docker，包括2个信息：name和version',
        en: `The runtime of containers. Default value: docker. Specify the runtime name and version.`
      },
      example: `name=docker,version=19.03.5`,
      options: {
        name: {
          desc: {
            zh: '容器运行时名称',
            en: ` runtime name `
          }
        },
        version: {
          desc: {
            zh: '容器运行时版本',
            en: ` runtime version `
          }
        }
      }
    },
    'image-id': {
      mapping: 'imageId',
      desc: {
        zh: '自定义镜像，默认使用系统镜像。当选择自定义镜像时，将取代默认系统镜像。',
        en: `Custom image, system image is used by default. When selecting a custom image, it will replace the default system image.`
      }
    },
    'user-data': {
      mapping: 'userData',
      desc: {
        zh: 'RDS实例列表，将该ECS加入到选择的RDS实例的白名单中。',
        en: `RDS instance list, add the ECS to the whitelist of the selected RDS instance.`
      }
    },
    'nodepool-id': {
      mapping: 'nodepoolId',
      desc: {
        zh: `节点池ID。`,
        en: `Node pool ID.`
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