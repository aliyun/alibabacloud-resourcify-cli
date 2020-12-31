'use strict';

let { default: Client } = require(`@alicloud/cs20151215`);
let runtime = require('../../../../../lib/runtime.js');
let output = require('../../../../../lib/output.js');

exports.cmdObj = {
  desc: {
    en: 'Create a ACK edge cluster',
    zh: '创建 ACK 边缘托管版集群'
  },
  options: {
    name: {
      required: true,
      mapping: 'CreateClusterRequest.name',
      vtype: 'string',
      desc: {
        zh: '集群名称， 集群名称可以使用大小写英文字母、中文、数字、中划线。',
        en: `The name of the cluster. The name can contain uppercase letters, lowercase letters, Chinese characters, digits, and hyphens (-).`
      }
    },
    'cluster-type': {
      mapping: 'CreateClusterRequest.clusterType',
      unchanged: true,
      default: 'ManagedKubernetes',
      desc: {
        zh: '集群类型',
        en: `The type of the cluster`
      },
    },
    'addons': {
      mapping: 'CreateClusterRequest.addons',
      vtype: 'array',
      subType: 'map',
      desc: {
        zh: `Kubernetes集群的addon插件的组合
网络插件：包含Flannel和Terway网络插件，二选一。
    当选择flannel类型网络时："container-cidr"为必传参数，且addons值必须包含flannel，例如:[{"name":"flannel"}]。
    当选择terway类型网络时："pod-vswitch-ids"为必传参数，且addons值必须包含terway-eni,例如： [{"name": "terway-eni"}]。
日志服务：可选，如果不开启日志服务时，将无法使用集群审计功能。
Ingress：默认开启安装Ingress组件nginx-ingress-controller`,
        en: `The add-ons to be installed for the cluster.
Configure the parameters of add-ons as follows:
name: Required. The name of the add-on.
version: Optional. The default value is the latest version.
config: Optional.
Network plug-in: Select Flannel or Terway.
Log Service: Optional. If Log Service is disabled, the cluster audit feature is unavailable.
Ingress: The nginx-ingress-controller component is installed by default.`
      },
      example: `name=flannel name=csi-plugin name=csi-provisioner name=nginx-ingress-controller,disabled=true`,
      options: {
        name: {
          mapping: 'name',
          vtype: 'string',
          required: true,
          desc: {
            zh: 'addon插件名称',
            en: `The name of the add-on.`
          }
        },
        disable: {
          mapping: 'disable',
          vtype: 'boolean',
          desc: {
            zh: '取值为空时默认取最新版本',
            en: `The default value is the latest version`
          }
        },
        config: {
          mapping: 'config',
          vtype: 'string',
          desc: {
            zh: '取值为空时表示无需配置',
            en: `Optional`
          }
        }
      }
    },
    'disable-rollback': {
      mapping: 'CreateClusterRequest.disableRollback',
      vtype: 'boolean',
      desc: {
        zh: '失败是否回滚',
        en: `Specifies whether to retain all resources if the operation fails. Valid values:
  true: retains the resources.
  false: releases the resources.
  Default value: true. We recommend that you use the default value.`
      },
      default: false
    },
    'timeout-mins': {
      mapping: 'CreateClusterRequest.timeoutMins',
      vtype: 'number',
      desc: {
        zh: '集群资源栈创建超时时间，以分钟为单位，默认值 60',
        en: `The timeout period in minutes during which a resource creation operation must be completed. Default value: 60.`
      },
      default: 60
    },
    'kubernetes-version': {
      mapping: 'CreateClusterRequest.kubernetesVersion',
      vtype: 'string',
      desc: {
        zh: 'Kubernetes集群版本，默认最新版',
        en: `The Kubernetes version. We recommend that you use the latest version.`
      }
    },
    region: {
      mapping: 'CreateClusterRequest.regionId',
      alias: 'r',
      desc: {
        zh: '集群所在地域ID',
        en: `The ID of the region where the cluster is deployed.`
      }
    },
    'snat-entry': {
      mapping: 'CreateClusterRequest.snatEntry',
      vtype: 'boolean',
      default: false,
      desc: {
        zh: `是否为网络配置SNAT：
当已有VPC能访问公网环境时，设置为 false。
当已有VPC不能访问公网环境时：
设置为true，表示配置SNAT，此时可以访问公网环境。
设置为false，表示不配置SNAT，此时不能访问公网环境`,
        en: `Specifies whether to enable Source Network Address Translation (SNAT).
If the VPC has Internet access, set this parameter to false.
If the VPC has no Internet access, valid values include:
true: configures SNAT. This enables the cluster to access the Internet.
false: does not configure SNAT. The prevents the cluster from accessing the Internet.`
      }
    },
    'vswitch-ids': {
      required: true,
      mapping: 'CreateClusterRequest.vswitchIds',
      vtype: 'array',
      subType: 'string',
      maxindex: 3,
      desc: {
        zh: '交换机ID。List长度范围为[1,3]',
        // TODO
        en: ``
      }
    },
    'cloud-monitor-flags': {
      mapping: 'CreateClusterRequest.cloudMonitorFlags',
      vtype: 'boolean',
      desc: {
        zh: '是否安装云监控插件',
        en: 'Specifies whether to install the CloudMonitor agent.'
      },
      default: false
    },
    'endpoint-public-access': {
      mapping: 'CreateClusterRequest.endpointPublicAccess',
      vtype: 'boolean',
      desc: {
        zh: '是否开启公网API Server',
        en: `Specifies whether to enable Internet access to the API server.`
      },
      default: true
    },
    'deletion-protection': {
      mapping: 'CreateClusterRequest.deletionProtection',
      vtype: 'boolean',
      default: false,
      desc: {
        zh: '是否开启集群删除保护，防止通过控制台或API误删除集群',
        en: `Specifies whether to enable cluster deletion protection. If this option is enabled, the cluster cannot be deleted by operations in the console or API operations.`
      }
    },
    'node-cidr-mask': {
      mapping: 'CreateClusterRequest.nodeCidrMask',
      vtype: 'string',
      desc: {
        zh: '节点网络的网络前缀',
        en: `The prefix length of the node CIDR block.`
      },
    },
    tags: {
      mapping: 'CreateClusterRequest.tags',
      vtype: 'array',
      subType: 'map',
      desc: {
        zh: '给集群打tag标签：key：标签名称；value：标签值',
        en: `The tags of the cluster.`
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
            en: `the value of the tag.`
          }
        }
      }
    },
    'profile': {
      required: true,
      mapping: 'CreateClusterRequest.profile',
      vtype: 'string',
      desc: {
        zh: '边缘集群标示',
        // TODO
        en: ``
      }
    },
    'worker-instance-types': {
      required: true,
      mapping: 'CreateClusterRequest.workerInstanceTypes',
      vtype: 'array',
      subType: 'string',
      desc: {
        zh: 'Worker节点实例规格，可以配置多个规格。',
        en: `The ECS instance types of worker nodes`
      }
    },
    'num-of-nodes': {
      required: true,
      mapping: 'CreateClusterRequest.numOfNodes',
      vtype: 'number',
      desc: {
        zh: 'Worker节点数。范围是[0，100]',
        en: `The number of worker nodes. Valid values: 0 to 100.`
      }
    },
    'worker-system-disk-category': {
      required: true,
      mapping: 'CreateClusterRequest.workerSystemDiskCategory',
      vtype: 'string',
      desc: {
        zh: 'Worker节点系统盘类型',
        en: `The system disk type of worker nodes`
      },
      choices: [
        'cloud_efficiency',
        'cloud_ssd'
      ]
    },
    'worker-system-disk-size': {
      required: true,
      mapping: 'CreateClusterRequest.workerSystemDiskSize',
      vtype: 'number',
      desc: {
        zh: 'Worker节点系统盘大小，单位为GiB',
        en: `The system disk size of a worker node. Unit: GiB.`
      }
    },
    'container-cidr': {
      mapping: 'CreateClusterRequest.containerCidr',
      vtype: 'string',
      desc: {
        zh: '容器网段，不能和VPC网段冲突。当选择系统自动创建VPC时，默认使用172.16.0.0/16网段。当创建flannel网络类型的集群时，该字段为必填',
        en: `The CIDR block of containers. This CIDR block cannot overlap with that of the VPC. If the VPC is automatically created by the system, the CIDR block of containers is set to 172.16.0.0/16.`
      },
      attributes: {
        required: [
          {
            'addons[*].name': {
              type: 'noInclude',
              value: ['terway-eni', 'terway-eiip']
            }
          }
        ]
      }
    },
    'worker-data-disks': {
      mapping: 'CreateClusterRequest.workerDataDisks',
      vtype: 'array',
      subType: 'map',
      desc: {
        zh: `Worker数据盘类型、大小等配置的组合。该参数只有在挂载Worker节点数据盘时有效`,
        en: `The data disk configurations of worker nodes, such as the disk type and disk size. This parameter takes effect only if worker_data_disk is set to true.`
      },
      options: {
        autoSnapshotPolicyId: {
          mapping: 'autoSnapshotPolicyId',
          vtype: 'string',
          desc: {
            zh: '选择自动快照策略ID，云盘会按照快照策略自动备份。',
            // TODO
            en: ``
          }
        },
        category: {
          mapping: 'category',
          vtype: 'string',
          desc: {
            zh: '数据盘类型',
            en: `the type of the data disks`
          }
        },
        size: {
          mapping: 'size',
          vtype: 'string',
          desc: {
            zh: '数据盘大小，单位为GiB',
            en: ` the size of a data disk. Unit: GiB.`
          }
        },
        encrypted: {
          mapping: 'encrypted',
          vtype: 'string',
          desc: {
            zh: '是否对数据盘加密',
            en: `specifies whether to encrypt data disks.`
          },
          choices: [
            'true',
            'false'
          ]
        }
      }
    },
    'worker-instance-charge-type': {
      required: true,
      mapping: 'CreateClusterRequest.workerInstanceChargeType',
      desc: {
        zh: `Worker节点付费类型:
PrePaid：预付费
PostPaid：按量付费`,
        en: `The billing method of worker nodes. Valid values:
PrePaid: subscription.
PostPaid: pay-as-you-go.`
      },
      choices: [
        'PrePaid',
        'PostPaid'
      ],
      default: 'PostPaid'
    },
    'vpcid': {
      required: true,
      mapping: 'CreateClusterRequest.vpcid',
      vtype: 'string',
      desc: {
        zh: '集群使用的VPC',
        en: `The ID of the VPC.`
      }
    },
    'service-cidr': {
      required: true,
      mapping: 'CreateClusterRequest.serviceCidr',
      vtype: 'string',
      desc: {
        zh: 'Service网络的网段，不能和VPC网段及Pod网络网段冲突。当选择系统自动创建VPC时，默认使用172.19.0.0/20网段',
        en: `The CIDR block of services. This CIDR block cannot overlap with that of the VPC or containers. If the VPC is automatically created by the system, the CIDR block of services is set to 172.19.0.0/20.`
      },
      default: '172.19.0.0/20'
    },
    'key-pair': {
      mapping: 'CreateClusterRequest.keyPair',
      desc: {
        zh: 'key_pair名称',
        en: `key pair.`
      }
    },
    'login-password': {
      mapping: 'CreateClusterRequest.loginPassword',
      vtype: 'string',
      desc: {
        zh: 'SSH登录密码。密码规则为8~30 个字符，且至少同时包含三项（大小写字母、数字和特殊符号）',
        en: `The SSH logon password. The password must be 8 to 30 characters in length and contain at least three of the following character types: uppercase letters, lowercase letters, digits, and special characters`
      }
    },
    'security-group-id': {
      mapping: 'CreateClusterRequest.securityGroupId',
      vtype: 'string',
      desc: {
        zh: '指定集群ECS实例所属于的安全组ID',
        en: `The ID of the security group to which the ECS instances in the cluster belong.`
      }
    },
    'is-enterprise': {
      mapping: 'CreateClusterRequest.isEnterpriseSecurityGroup',
      vtype: 'boolean',
      desc: {
        zh: '是否创建企业安全组',
        en: `Whether to create an enterprise security group`
      },
      attributes: {
        show: [
          {
            'security-group-id': {
              type: 'equal',
              value: undefined
            }
          }
        ]
      },
      default: true
    },
    'rds-instances': {
      mapping: 'CreateClusterRequest.rdsInstances',
      vtype: 'array',
      subType: 'string',
      desc: {
        zh: '如果指定了RDS实例列表，集群节点ECS会自动加入RDS访问白名单。',
        // TODO
        en: ``
      },
    },
  },
  conflicts: [
    {
      optNames: ['key-pair', 'login-password'],
      required: true
    },
    {
      optNames: ['security-group-id', 'is-enterprise']
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
  let CreateClusterRequest = require(`@alicloud/cs20151215`).CreateClusterRequest;
  let request = new CreateClusterRequest(ctx.mappingValue.CreateClusterRequest);
  let client = new Client(config);
  let result;
  try {
    result = await client.createClusterWithOptions(request, {}, runtime.getRuntimeOption());
  } catch (e) {
    output.error(e.message);
  }
  if (result) {
    result = result.body;
  }
  let data = JSON.stringify(result, null, 2);
  output.log(data);
};
