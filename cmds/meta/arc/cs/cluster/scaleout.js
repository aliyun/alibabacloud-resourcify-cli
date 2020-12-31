'use strict';

let { default: Client } = require(`@alicloud/cs20151215`);
const runtime = require('../../../../../lib/runtime.js');
let output = require('../../../../../lib/output.js');

exports.cmdObj = {
  desc: {
    zh: '增加集群中Worker节点的数量',
    en: `add worker nodes to a cluster. Worker nodes in a cluster can be deployed in multiple zones.`
  },
  options: {
    'count': {
      required: true,
      mapping: 'ScaleOutClusterRequest.count',
      vtype: 'number',
      desc: {
        zh: '扩容实例数量',
        en: `The number of worker nodes that you want to add.`
      }
    },
    'key-pair': {
      mapping: 'ScaleOutClusterRequest.keyPair',
      vtype: 'string',
      desc: {
        zh: 'key_pair名称',
        en: `The name of the key pair. You must set key_pair or login_password.`
      },
    },
    'login-password': {
      mapping: 'ScaleOutClusterRequest.loginPassword',
      vtype: 'string',
      desc: {
        zh: 'SSH登录密码。密码规则为8~30 个字符，且至少同时包含三项（大小写字母、数字和特殊符号），和key_pair 二选一。',
        en: `The SSH logon password. The password must be 8 to 30 characters in length and contain at least three of the following character types: uppercase letters, lowercase letters, digits, and special characters. You must set login_password or key_pair.`
      }
    },
    'worker-data-disk': {
      mapping: 'ScaleOutClusterRequest.workerDataDisk',
      vtype: 'boolean',
      desc: {
        zh: '表示worker节点是否挂载数据盘',
        en: `Specifies whether to mount data disks to worker nodes.`
      }
    },
    'worker-data-disks': {
      mapping: 'ScaleOutClusterRequest.workerDataDisks',
      vtype: 'array',
      subType: 'map',
      desc: {
        zh: `Worker数据盘类型、大小等配置的组合`,
        en: `The data disk configurations of worker nodes, such as the disk type and disk size. This parameter takes effect only if worker-data-disk is set to true.`
      },
      attributes: {
        show: [
          {
            'worker-data-disk': {
              type: 'equal',
              value: true
            }
          }
        ],
        required: [
          {
            'worker-data-disk': {
              type: 'equal',
              value: true
            }
          }
        ]
      },
      example: `category=cloud,size=40,encrypted=false`,
      options: {
        category: {
          mapping: 'category',
          desc: {
            zh: '数据盘类型',
            en: `the type of the data disks`
          },
          choices: [
            'cloud',
            'cloud_efficiency',
            'cloud_ssd'
          ]
        },
        size: {
          vtype: 'number',
          mapping: 'size',
          desc: {
            zh: '数据盘大小，单位为GiB',
            en: `the size of a data disk. Unit: GiB.`
          }
        },
        encrypted: {
          mapping: 'encrypted',
          desc: {
            zh: '是否对数据盘加密',
            en: `specifies whether to encrypt data disks. `
          },
          choices: [
            'true',
            'false'
          ]
        },
        'auto-snapshot-policy-id': {
          mapping: 'autoSnapshotPolicyId',
          vtype: 'string',
          desc: {
            zh: '开启云盘备份时的自动备份策略',
            en: `Automatic backup strategy when cloud disk backup is enabled`
          },
          required: true
        }
      }
    },
    'worker-instance-types': {
      required: true,
      mapping: 'ScaleOutClusterRequest.workerInstanceTypes',
      vtype: 'array',
      subType: 'string',
      desc: {
        zh: 'Worker节点ECS规格类型代码',
        en: `The ECS instance types of worker nodes. `
      },
    },
    'worker-instance-charge-type': {
      mapping: 'ScaleOutClusterRequest.workerInstanceChargeType',
      desc: {
        zh: `Worker节点付费类型：
PrePaid：预付费
PostPaid：按量付费`,
        en: `The billing method of worker nodes. Valid values:
PrePaid: subscription.
PostPaid: pay-as-you-go.
Default value: PostPaid.`
      },
      choices: [
        'PrePaid',
        'PostPaid'
      ]
    },
    'worker-period': {
      mapping: 'ScaleOutClusterRequest.workerPeriod',
      vtype: 'number',
      desc: {
        zh: '包年包月时长，当worker_instance_charge_type取值为PrePaid时才生效且为必选值，取值范围：PeriodUnit=Month时，Period取值：{ “1”， “2”， “3”， “6”， “12”}',
        en: `The subscription duration of worker nodes. This parameter takes effect and is required only if worker-instance-charge-type is set to PrePaid. If worker-period-unit is set to Month, valid values of worker-period include 1, 2, 3, 6, and 12.`
      },
      attributes: {
        show: [
          {
            'worker-instance-charge-type': {
              type: 'equal',
              value: 'PrePaid'
            }
          }
        ],
        required: [
          {
            'worker-instance-charge-type': {
              type: 'equal',
              value: 'PrePaid'
            }
          }
        ]
      }
    },
    'worker-period-unit': {
      mapping: 'ScaleOutClusterRequest.workerPeriodUnit',
      desc: {
        zh: '当指定为PrePaid的时候需要指定周期。Month：以月为计时单位',
        en: `The unit of the subscription duration. This parameter is required if worker-instance-charge-type is set to PrePaid. A value of Month indicates that the subscription duration is measured in months`
      },
      attributes: {
        show: [
          {
            'worker-instance-charge-type': {
              type: 'equal',
              value: 'PrePaid'
            }
          }
        ],
        required: [
          {
            'worker-instance-charge-type': {
              type: 'equal',
              value: 'PrePaid'
            }
          }
        ]
      }
    },
    'worker-auto-renew': {
      mapping: 'ScaleOutClusterRequest.workerAutoRenew',
      vtype: 'boolean',
      desc: {
        zh: '是否开启Worker节点自动续费',
        en: `Specifies whether to enable auto renewal for worker nodes`
      },
      attributes: {
        show: [
          {
            'worker-instance-charge-type': {
              type: 'equal',
              value: 'PrePaid'
            }
          }
        ],
        required: [
          {
            'worker-instance-charge-type': {
              type: 'equal',
              value: 'PrePaid'
            }
          }
        ]
      }
    },
    'worker-auto-renew-period': {
      mapping: 'ScaleOutClusterRequest.workerAutoRenewPeriod',
      vtype: 'number',
      desc: {
        zh: 'Worker节点自动续费周期，当选择预付费和自动续费时才生效',
        en: `The auto renewal period for worker nodes. This parameter takes effect and is required only if worker_instance_charge_type is set to PrePaid and worker_auto_renew is set to true. If worker-period-unit is set to Month, valid values of worker-auto-renew-period include 1, 2, 3, 6, and 12.`
      },
      attributes: {
        show: [
          {
            'worker-auto-renew': {
              type: 'equal',
              value: true
            }
          }
        ],
        required: [
          {
            'worker-auto-renew': {
              type: 'equal',
              value: true
            }
          }
        ]
      }
    },
    'worker-system-disk-category': {
      mapping: 'ScaleOutClusterRequest.workerSystemDiskCategory',
      desc: {
        zh: 'Worker节点系统盘类型',
        en: `The system disk type of worker nodes.`
      },
      choices: [
        'cloud_efficiency',
        'cloud_ssd'
      ]
    },
    'worker-system-disk-size': {
      mapping: 'ScaleOutClusterRequest.workerSystemDiskSize',
      vtype: 'number',
      desc: {
        zh: 'Worker节点系统盘大小，单位为GiB',
        en: `The system disk size of a worker node. Unit: GiB.`
      }
    },
    'cloud-monitor-flags': {
      mapping: 'ScaleOutClusterRequest.cloudMonitorFlags',
      vtype: 'boolean',
      desc: {
        zh: '是否安装云监控插件',
        en: `Specifies whether to install the CloudMonitor agent.`
      }
    },
    'disable-rollback': {
      mapping: 'ScaleOutClusterRequest.disableRollback',
      vtype: 'boolean',
      desc: {
        zh: '失败是否回滚',
        en: `Specifies whether to retain all resources if the operation fails. `
      }
    },
    'cpu-policy': {
      mapping: 'ScaleOutClusterRequest.cpuPolicy',
      vtype: 'string',
      desc: {
        zh: 'CPU策略。集群版本为1.12.6及以上版本支持static 和 none两种策略。默认为none',
        en: `The CPU policy. For Kubernetes 1.12.6 and later, valid values of cpu_policy include static and none. Default value: none.`
      },
      default: 'none'
    },
    'image-id': {
      mapping: 'ScaleOutClusterRequest.imageId',
      vtype: 'string',
      desc: {
        zh: '自定义镜像',
        en: `Custom Image`
      }
    },
    'user-data': {
      mapping: 'ScaleOutClusterRequest.userData',
      vtype: 'string',
      desc: {
        zh: '节点自定义数据',
        en: `User Data`
      }
    },
    'rds-instances': {
      mapping: 'ScaleOutClusterRequest.rdsInstances',
      vtype: 'array',
      subType: 'string',
      desc: {
        zh: 'RDS实例',
        en: `RDS instances`
      }
    },
    'vswitch-ids': {
      mapping: 'ScaleOutClusterRequest.vswitchIds',
      vtype: 'array',
      subType: 'string',
      maxindex: 3,
      desc: {
        zh: 'Worker节点的虚拟交换机ID列表',
        en: `The VSwitch IDs of worker nodes. Specify one to three VSwitch IDs. We recommend that you specify three VSwitches in different zones to ensure high availability.`
      },
    },
    tags: {
      mapping: 'ScaleOutClusterRequest.tags',
      vtype: 'array',
      subType: 'map',
      desc: {
        zh: '给集群打tag标签：key：标签名称；value：标签值',
        en: `The tags of the cluster.
key: the name of the tag.
value: the value of the tag.`
      },
      example: `key=tier,value=backend`,
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
            en: `the value of the tag`
          }
        }
      }
    },
    taints: {
      mapping: 'ScaleOutClusterRequest.taints',
      vtype: 'array',
      subType: 'map',
      mappingType: require('@alicloud/cs20151215').ScaleOutClusterRequestTaints,
      desc: {
        zh: '用于给节点做污点标记，通常用于Pods的调度策略。与之相对应的概念为：容忍（tolerance），若Pods上有相对应的tolerance标记，则可以容忍节点上的污点，并调度到该节点。',
        en: `The taints that are added to nodes to ensure appropriate scheduling of pods. If a pod has a toleration that matches the taint on a node, this pod can be scheduled to the node.`
      },
      example: `key=tier,value=backend`,
      options: {
        key: {
          mapping: 'key',
          desc: {
            zh: 'taints名称',
            en: `the name of taint`
          }
        },
        value: {
          mapping: 'value',
          desc: {
            zh: 'taints值',
            en: `the value of taint`
          }
        },
        effect: {
          mapping: 'effect',
          desc: {
            zh: '调度策略。',
            en: `the effect of taint`
          }
        }
      }
    },
    'runtime': {
      mapping: 'ScaleOutClusterRequest.runtime',
      vtype: 'map',
      desc: {
        zh: '容器运行时，一般为docker，包括2个信息：name和version',
        en: `The runtime of containers. Default value: docker. Specify the runtime name and version.`
      },
      options: {
        name: {
          mapping: 'name',
          desc: {
            zh: '容器运行时名称',
            en: ` runtime name `
          }
        },
        version: {
          mapping: 'version',
          desc: {
            zh: '容器运行时版本',
            en: ` runtime version `
          }
        }
      }
    },
  },
  conflicts: [
    {
      optNames: ['key-pair', 'login-password'],
      required: true
    }
  ],
  args: [
    {
      name: 'clusterId',
      required: true,
      vtype: 'string'
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
  let ScaleOutClusterRequest = require(`@alicloud/cs20151215`).ScaleOutClusterRequest;
  let request = new ScaleOutClusterRequest(ctx.mappingValue.ScaleOutClusterRequest);

  let client = new Client(config);
  let result;
  try {
    result = await client.scaleOutClusterWithOptions(ctx.argv[0], request, {}, runtime.getRuntimeOption());
  } catch (e) {
    output.error(e.message);
  }
  if (result) {
    result = result.body;
  }
  let data = JSON.stringify(result, null, 2);
  output.log(data);
};