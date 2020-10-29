'use strict';

let { default: Client } = require(`@alicloud/cs20151215`);
let runtime = require('../../../../../lib/runtime.js');
let output = require('../../../../../lib/output.js');

exports.cmdObj = {
  desc: {
    en: 'Create a k8s dedicated cluster',
    zh: '创建 k8s 专有版集群'
  },
  options: {
    region: {
      mapping: 'regionId',
      alias: 'r',
      hide: true,
      desc: {
        zh: '集群所在地域ID',
        en: `The ID of the region where the cluster is deployed.`
      }
    },
    'cluster-type': {
      mapping: 'clusterType',
      unchanged: true,
      default: 'Kubernetes',
      desc: {
        zh: '集群类型',
        en: `The type of the cluster`
      }
    },
    name: {
      mapping: 'name',
      desc: {
        zh: '集群名称， 集群名称可以使用大小写英文字母、中文、数字、中划线。',
        en: `The name of the cluster. The name can contain uppercase letters, lowercase letters, Chinese characters, digits, and hyphens (-).`
      }
    },
    'key-pair': {
      required: true,
      mapping: 'keyPair',
      desc: {
        zh: 'key_pair名称',
        en: `The name of the key pair.`
      },
      conflicts: [
        'login-password'
      ]
    },
    'login-password': {
      required: true,
      mapping: 'loginPassword',
      desc: {
        zh: 'SSH登录密码。密码规则为8~30 个字符，且至少同时包含三项（大小写字母、数字和特殊符号）',
        en: `The SSH logon password. The password must be 8 to 30 characters in length and contain at least three of the following character types: uppercase letters, lowercase letters, digits, and special characters`
      },
      conflicts: [
        'key-pair'
      ]
    },
    'snat-entry': {
      required: true,
      mapping: 'snatEntry',
      vtype: 'boolean',
      desc: {
        zh: `是否为网络配置SNAT：
                当已有VPC能访问公网环境时，设置为 false。
                当已有VPC不能访问公网环境时：
                设置为true，表示配置SNAT，此时可以访问公网环境。
                设置为false，表示不配置SNAT，此时不能访问公网环境
                `,
        en: `Specifies whether to enable Source Network Address Translation (SNAT).
                If the VPC has Internet access, set this parameter to false.
                If the VPC has no Internet access, valid values include:
                true: configures SNAT. This enables the cluster to access the Internet.
                false: does not configure SNAT. The prevents the cluster from accessing the Internet.
                `
      }
    },
    'worker-system-disk-category': {
      required: true,
      mapping: 'workerSystemDiskCategory',
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
      mapping: 'workerSystemDiskSize',
      vtype: 'number',
      desc: {
        zh: 'Worker节点系统盘大小，单位为GiB',
        en: `The system disk size of a worker node. Unit: GiB.`
      }
    },
    'container-cidr': {
      mapping: 'containerCidr',
      dependency: true,
      desc: {
        zh: '容器网段，不能和VPC网段冲突。当选择系统自动创建VPC时，默认使用172.16.0.0/16网段。当创建flannel网络类型的集群时，该字段为必填',
        en: `The CIDR block of containers. This CIDR block cannot overlap with that of the VPC. If the VPC is automatically created by the system, the CIDR block of containers is set to 172.16.0.0/16.`
      }
    },
    'cloud-monitor-flags': {
      mapping: 'cloudMonitorFlags',
      vtype: 'boolean',
      desc: {
        zh: '是否安装云监控插件',
        en: 'Specifies whether to install the CloudMonitor agent.'
      }
    },
    'disable-rollback': {
      mapping: 'disableRollback',
      vtype: 'boolean',
      desc: {
        zh: '失败是否回滚',
        en: `Specifies whether to retain all resources if the operation fails. Valid values:
                true: retains the resources.
                false: releases the resources.
                Default value: true. We recommend that you use the default value.
                `
      }
    },
    'endpoint-public-access': {
      mapping: 'endpointPublicAccess',
      vtype: 'boolean',
      desc: {
        zh: '是否开启公网API Server',
        en: `Specifies whether to enable Internet access to the API server.`
      }
    },
    'proxy-mode': {
      mapping: 'proxyMode',
      desc: {
        zh: 'kube-proxy代理模式,默认为iptables',
        en: `The kube-proxy mode. Valid values: iptables and ipvs. Default value: iptables.`
      },
      choices: [
        'iptables',
        'ipvs'
      ]
    },
    'security-group-id': {
      mapping: 'securityGroupId',
      desc: {
        zh: '指定集群ECS实例所属于的安全组ID',
        en: `The ID of the security group to which the ECS instances in the cluster belong.`
      },
      sufficient: function (val) {
        let optList = {};
        if (!val) {
          optList['is-enterprise'] = false;
        }
        return optList;
      }
    },
    'service-cidr': {
      mapping: 'serviceCidr',
      desc: {
        zh: 'Service网络的网段，不能和VPC网段及Pod网络网段冲突。当选择系统自动创建VPC时，默认使用172.19.0.0/20网段',
        en: `The CIDR block of services. This CIDR block cannot overlap with that of the VPC or containers. If the VPC is automatically created by the system, the CIDR block of services is set to 172.19.0.0/20.`
      }
    },
    'timeout-mins': {
      mapping: 'timeoutMins',
      vtype: 'number',
      desc: {
        zh: '集群资源栈创建超时时间，以分钟为单位，默认值 60',
        en: `	
                The timeout period in minutes during which a resource creation operation must be completed. Default value: 60.`
      }
    },
    'vpcid': {
      required: true,
      mapping: 'vpcid',
      desc: {
        zh: 'vpcId和vswitchid只能同时都设置对应的值',
        en: `The ID of the VPC. If this parameter is not specified, the system automatically creates a VPC that uses CIDR block 192.168.0.0/16.`
      }
    },
    'worker-auto-renew': {
      mapping: 'workerAutoRenew',
      vtype: 'boolean',
      dependency: true,
      desc: {
        zh: '是否开启Worker节点自动续费',
        en: `Specifies whether to enable auto renewal for worker nodes`
      },
      sufficient: function (val) {
        let optList = {};
        if (val) {
          optList['worker-auto-renew-period'] = true;
        }
        return optList;
      }
    },
    'worker-auto-renew-period': {
      mapping: 'workerAutoRenewPeriod',
      dependency: true,
      vtype: 'number',
      desc: {
        zh: 'Worker节点自动续费周期，当选择预付费和自动续费时才生效',
        en: `The auto renewal period for worker nodes. This parameter takes effect and is required only if worker-instance-charge-type is set to PrePaid and worker-auto-renew is set to true. If worker-period-unit is set to Month, valid values of worker-auto-renew-period include 1, 2, 3, 6, and 12.`
      }
    },
    'worker-data-disk': {
      mapping: 'workerDataDisk',
      vtype: 'boolean',
      desc: {
        zh: '表示worker节点是否挂载数据盘',
        en: `Specifies whether to mount data disks to worker nodes`
      },
      sufficient: function (val) {
        let optList = {};
        if (val) {
          optList['worker-data-disks'] = true;
        }
        return optList;
      }
    },
    'worker-data-disks': {
      mapping: 'workerDataDisks',
      dependency: true,
      vtype: 'array',
      subType: 'map',
      mappingType: require('@alicloud/cs20151215').CreateClusterRequestWorkerDataDisks,
      desc: {
        zh: `Worker数据盘类型、大小等配置的组合。该参数只有在挂载Worker节点数据盘时有效`,
        en: `The data disk configurations of worker nodes, such as the disk type and disk size. This parameter takes effect only if worker_data_disk is set to true.`
      },
      options: {
        autoSnapshotPolicyId: {
          desc: {
            zh: '是否开启云盘备份',
            en: `Whether to enable snapshot`
          },
          choices: [
            'true',
            'false'
          ]
        },
        category: {
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
          desc: {
            zh: '数据盘大小，单位为GiB',
            en: ` the size of a data disk. Unit: GiB.`
          }
        },
        encrypted: {
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
      mapping: 'workerInstanceChargeType',
      desc: {
        zh: `Worker节点付费类型:
                PrePaid：预付费
                PostPaid：按量付费
                `,
        en: `The billing method of worker nodes. Valid values:
                PrePaid: subscription.
                PostPaid: pay-as-you-go.
                `
      },
      choices: [
        'PrePaid',
        'PostPaid'
      ],
      sufficient: function (val) {
        let optList = {};
        if (val === 'PrePaid') {
          optList['worker-period'] = true;
          optList['worker-auto-renew'] = true;
          optList['worker-period-unit'] = true;
        }
        return optList;
      }
    },
    'worker-period': {
      mapping: 'workerPeriod',
      vtype: 'number',
      dependency: true,
      desc: {
        zh: '包年包月时长，当worker-instance-charge-type取值为PrePaid时才生效且为必选值，取值范围：PeriodUnit=Month时，Period取值：{ “1”， “2”， “3”， “6”， “12”}',
        en: `The subscription duration of worker nodes. This parameter takes effect and is required only if worker-instance-charge-type is set to PrePaid. If worker_period_unit is set to Month, valid values of worker_period include 1, 2, 3, 6, and 12.`
      }
    },
    'worker-period-unit': {
      mapping: 'workerPeriodUnit',
      dependency: true,
      desc: {
        zh: '当指定为PrePaid的时候需要指定周期。Month：以月为计时单位',
        en: `The unit of the subscription duration`
      }
    },
    'worker-instance-types': {
      required: true,
      mapping: 'workerInstanceTypes',
      vtype: 'array',
      subType: 'string',
      desc: {
        zh: 'Worker节点ECS规格类型代码',
        en: `The ECS instance types of worker nodes`
      },
      options: {
        element: {
          desc: {
            zh: 'ECS规格类型代码',
            en: `The ECS instance type`
          }
        }
      }
    },
    'cpu-policy': {
      mapping: 'cpuPolicy',
      desc: {
        zh: 'CPU策略。集群版本为1.12.6及以上版本支持static 和 none两种策略。默认为none',
        en: `The CPU policy. For Kubernetes 1.12.6 and later, valid values of cpu_policy include static and none. Default value: none.`
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
    platform: {
      mapping: 'platform',
      desc: {
        zh: '运行pod的主机的平台架构，如 x86',
        en: `The architecture of the nodes that run pods, for example, x86.`
      }
    },
    'os-type': {
      mapping: 'osType',
      desc: {
        zh: '运行pod的主机的操作系统类型',
        en: `The operating system of the nodes that run pods. For example, Linux and Windows.`
      }
    },
    'kubernetes-version': {
      mapping: 'kubernetesVersion',
      desc: {
        zh: 'Kubernetes集群版本，默认最新版',
        en: `The Kubernetes version. We recommend that you use the latest version.`
      }
    },
    'deletion-protection': {
      mapping: 'deletionProtection',
      vtype: 'boolean',
      desc: {
        zh: '是否开启集群删除保护，防止通过控制台或API误删除集群',
        en: `Specifies whether to enable cluster deletion protection. If this option is enabled, the cluster cannot be deleted by operations in the console or API operations.`
      }
    },
    'master-system-disk-category': {
      required: true,
      mapping: 'masterSystemDiskCategory',
      desc: {
        zh: 'Master节点系统盘类型',
        en: `The system disk type of master nodes`
      },
      choices: [
        'cloud_efficiency',
        'cloud_ssd'
      ]
    },
    'master-system-disk-size': {
      required: true,
      mapping: 'masterSystemDiskSize',
      vtype: 'number',
      desc: {
        zh: 'Master节点系统盘大小，单位为GiB',
        en: `The system disk size of a master node. Unit: GiB.`
      }
    },
    'num-of-nodes': {
      required: true,
      mapping: 'numOfNodes',
      vtype: 'number',
      desc: {
        zh: 'Worker节点数。范围是[0，100]',
        en: `The number of worker nodes. Valid values: 0 to 100.`
      },
      validate: function (val) {
        if (val < 0 || val > 100) {
          return false;
        }
        return true;
      }
    },
    'master-instance-types': {
      required: true,
      mapping: 'masterInstanceTypes',
      vtype: 'array',
      subType: 'string',
      desc: {
        zh: 'Master节点ECS规格类型代码',
        en: 'The ECS instance types of master nodes'
      },
      options: {
        element: {
          desc: {
            zh: 'ECS规格类型代码',
            en: `ECS instance type`
          }
        }
      }
    },
    'master-vswitch-ids': {
      required: true,
      mapping: 'masterVswitchIds',
      vtype: 'array',
      maxindex: 3,
      subType: 'string',
      desc: {
        zh: 'Master节点交换机ID列表，交换机个数取值范围为1~3。为确保集群的高可用性，推荐您选择3个交换机，且分布在不同的可用区。',
        en: `The VSwitch IDs of master nodes. Specify one to three VSwitch IDs. We recommend that you specify three VSwitches in different zones to ensure high availability.`
      },
      options: {
        element: {
          required: true,
          desc: {
            zh: '交换机ID',
            en: `VSwitch ID`
          }
        }
      }
    },
    'worker-vswitch-ids': {
      required: true,
      mapping: 'workerVswitchIds',
      vtype: 'array',
      maxindex: 3,
      subType: 'string',
      desc: {
        zh: 'Worker节点的虚拟交换机ID列表',
        en: `The VSwitch IDs of worker nodes.`
      },
      options: {
        element: {
          desc: {
            zh: '交换机ID',
            en: `VSwitch ID`
          }
        }
      }
    },
    'ssh-flags': {
      mapping: 'sshFlags',
      vtype: 'boolean',
      desc: {
        zh: '是否开放公网SSH登录',
        en: `Specifies whether to enable SSH logon.`
      }
    },
    'node-port-range': {
      mapping: 'nodePortRange',
      desc: {
        zh: '节点服务端口。取值范围为[30000，65535]',
        en: `The service port range of nodes. Valid values: 30000 to 65535.`
      },
      example: `30000-32767`
    },
    'master-instance-charge-type': {
      mapping: 'masterInstanceChargeType',
      desc: {
        zh: `Master节点付费类型:
                PrePaid：预付费
                PostPaid：按量付费
                `,
        en: `The billing method of master nodes. Valid values:
                PrePaid: subscription.
                PostPaid: pay-as-you-go.
                `
      },
      choices: [
        'PrePaid',
        'PostPaid'
      ],
      sufficient: function (val) {
        let optList = {};
        if (val === 'PrePaid') {
          optList['master-period'] = true;
          optList['master-period-unit'] = true;
          optList['master-auto-renew'] = true;
        }
        return optList;
      }
    },

    'master-period': {
      mapping: 'masterPeriod',
      vtype: 'number',
      dependency: true,
      desc: {
        zh: '包年包月时长，当master-instance-charge-type取值为PrePaid时才生效且为必选值，取值范围： PeriodUnit=Month时，Period取值：{ “1”， “2”， “3”，“6”，“12”}',
        en: `The subscription duration of master nodes. This parameter takes effect and is required only if master-instance-charge-type is set to PrePaid. If master_period_unit is set to Month, valid values of master_period include 1, 2, 3, 6, and 12.`
      },
    },
    'master-auto-renew': {
      mapping: 'masterAutoRenew',
      vtype: 'boolean',
      dependency: true,
      desc: {
        zh: 'Master节点是否自动续费',
        en: `Specifies whether to enable auto renewal for master nodes.`
      },
      sufficient: function (val) {
        let optList = {};
        if (val) {
          optList['master-auto-renew-period'] = true;
        }
        return optList;
      }
    },
    'master-auto-renew-period': {
      mapping: 'masterAutoRenewPeriod',
      vtype: 'number',
      dependency: true,
      desc: {
        zh: 'Master节点自动续费周期，当选择预付费和自动续费时才生效，且为必选值',
        en: `The auto renewal period for master nodes. This parameter takes effect and is required only if master-instance-charge-type is set to PrePaid and master-auto-renew is set to true. If master-period-unit is set to Month, valid values of master-auto-renew-period include 1, 2, 3, 6, and 12.`
      }
    },
    'master-period-unit': {
      mapping: 'masterPeriodUnit',
      dependency: true,
      desc: {
        zh: '当指定为PrePaid的时候需要指定周期。Month：以月为计时单位',
        en: `The unit of the subscription duration. This parameter is required if worker_instance_charge_type is set to PrePaid. A value of Month indicates that the subscription duration is measured in months.`
      }
    },
    'master-count': {
      mapping: 'masterCount',
      vtype: 'number',
      desc: {
        zh: 'Master实例个数，默认是3',
        en: `The number of master nodes. Valid values: 3 and 5. Default value: 3.`
      },
      choices: [
        3,
        5
      ]
    },
    'pod-vswitch-ids': {
      mapping: 'podVswitchIds',
      vtype: 'array',
      dependency: true,
      subType: 'string',
      desc: {
        zh: 'Pod的虚拟交换机列表，在ENI多网卡模式下，需要传额外的vswitchid给addon。当创建terway网络类型的集群时，该字段为必填。',
        en: `Pod VSwitch IDs, in ENI multi-network card mode, you need to pass additional vswitchid to addon. When creating a cluster of the terway network type, this field is required.`
      },
      options: {
        element: {
          desc: {
            zh: '交换机ID',
            en: `VSwitch ID`
          }
        }
      }
    },
    'node-cidr-mask': {
      mapping: 'nodeCidrMask',
      desc: {
        zh: '节点网络的网络前缀',
        en: `The prefix length of the node CIDR block.`
      }
    },
    tags: {
      mapping: 'tags',
      vtype: 'array',
      subType: 'map',
      mappingType: require('@alicloud/cs20151215').CreateClusterRequestTags,
      desc: {
        zh: '给集群打tag标签：key：标签名称；value：标签值',
        en: `The tags of the cluster.`
      },
      example: `key=tier,value=backend`,
      options: {
        key: {
          desc: {
            zh: '标签名称',
            en: `the name of the tag.`
          }
        },
        value: {
          desc: {
            zh: '标签值',
            en: `the value of the tag.`
          }
        }
      }
    },
    'addons': {
      mapping: 'addons',
      vtype: 'array',
      subType: 'map',
      mappingType: require('@alicloud/cs20151215').CreateClusterRequestAddons,
      desc: {
        zh: `Kubernetes集群的addon插件的组合
网络插件：包含Flannel和Terway网络插件，二选一。
    当选择flannel类型网络时："container-cidr"为必传参数，且addons值必须包含flannel，例如:[{"name":"flannel"}]。
    当选择terway类型网络时："pod-vswitch-ids"为必传参数，且addons值必须包含terway-eni,例如： [{"name": "terway-eni"}]。
日志服务：可选，如果不开启日志服务时，将无法使用集群审计功能。
Ingress：默认开启安装Ingress组件nginx-ingress-controller
`,
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
      sufficient: function (val) {
        let optList = {
          'container-cidr': false,
          'pod-vswitch-ids': false
        };
        if (!val) {
          return optList;
        }
        for (let value of val) {
          if (value.name === 'flannel') {
            optList['container-cidr'] = true;
          }
          if (value.name === 'terway') {
            optList['pod-vswitch-ids'] = true;
          }
        }
        return optList;
      },
      options: {
        name: {
          required: true,
          desc: {
            zh: 'addon插件名称',
            en: `The name of the add-on.`
          }
        },
        disable: {
          vtype: 'boolean',
          desc: {
            zh: '取值为空时默认取最新版本',
            en: `The default value is the latest version`
          }
        },
        config: {
          desc: {
            zh: '取值为空时表示无需配置',
            en: `Optional`
          }
        }
      }
    },
    'private-zone': {
      mapping: 'privateZone',
      desc: {
        zh: '是否开启PrivateZone用于服务发现',
        en: `Whether to enable PrivateZone for service discovery`
      },
      choices: [
        'true',
        'false'
      ]
    },
    'is-enterprise': {
      mapping: 'isEnterpriseSecurityGroup',
      vtype: 'boolean',
      dependency: true,
      desc: {
        zh: '是否创建企业安全组',
        en: `Whether to create an enterprise security group`
      }
    }
  },
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
  let request = new CreateClusterRequest(ctx.mappingValue);

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
