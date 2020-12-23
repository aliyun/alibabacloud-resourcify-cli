'use strict';
// TODO 文档不全
exports.cmdObj = {
  desc: {
    zh: '创建一个标准托管版安全沙箱Kubernetes集'
  },
  options: {
    'cluster-type': {
      mapping: 'CreateClusterRequest.clusterType',
      unchanged: true,
      default: 'ManagedKubernetes',
      desc: {
        zh: '集群类型',
        en: `The type of the cluster`
      },
    },
    region: {
      mapping: 'CreateClusterRequest.regionId',
      alias: 'r',
      desc: {
        zh: '集群所在地域ID',
        en: `The ID of the region where the cluster is deployed.`
      }
    },
    'addons': {
      required: true,
      mapping: 'CreateClusterRequest.addons',
      vtype: 'array',
      subType: 'map',
      desc: {
        zh: `Kubernetes集群的addon插件的组合
    网络插件：包含Flannel和Terway网络插件，二选一。
    存储插件：必选，支持CSI和FlexVolume两种类型。
    日志组件：可选, 如果不开启日志服务时，将无法使用集群审计功能。
    Ingress：可选，默认开启安装Ingress组件nginx-ingress-controller：
    事件中心：可选，默认开启。事件中心提供对Kubernetes事件的存储、查询、告警等能力。Kubernetes事件中心关联的Logstore在90天内免费。`,
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
          desc: {
            zh: '取值为空时表示无需配置',
            en: `Optional`
          }
        }
      }
    },
    'cloud-monitor-flags': {
      mapping: 'CreateClusterRequest.cloudMonitorFlags',
      vtype: 'boolean',
      desc: {
        zh: '是否安装云监控插件',
        en: 'Specifies whether to install the CloudMonitor agent.'
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
              type: 'equal',
              value: 'flannel'
            }
          }
        ]
      }
    },
    'cpu-policy': {
      mapping: 'CreateClusterRequest.cpuPolicy',
      vtype: 'string',
      default: 'none',
      desc: {
        zh: 'CPU策略。集群版本为1.12.6及以上版本支持static 和 none两种策略。默认为none',
        en: `The CPU policy. For Kubernetes 1.12.6 and later, valid values of cpu_policy include static and none. Default value: none.`
      }
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
    'disable-rollback': {
      mapping: 'CreateClusterRequest.disableRollback',
      vtype: 'boolean',
      default: false,
      desc: {
        zh: '失败是否回滚',
        en: `Specifies whether to retain all resources if the operation fails. Valid values:
true: retains the resources.
false: releases the resources.
Default value: true. We recommend that you use the default value.`
      }
    },
    'endpoint-public-access': {
      mapping: 'CreateClusterRequest.endpointPublicAccess',
      vtype: 'boolean',
      default: true,
      desc: {
        zh: '是否开启公网API Server',
        en: `Specifies whether to enable Internet access to the API server.`
      }
    },
    'is-enterprise': {
      mapping: 'CreateClusterRequest.isEnterpriseSecurityGroup',
      vtype: 'boolean',
      default: false,
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
      }
    },
    'key-pair': {
      mapping: 'CreateClusterRequest.keyPair',
      desc: {
        zh: 'key_pair名称',
        en: `The name of the key pair.`
      }
    },
    'login-password': {
      mapping: 'CreateClusterRequest.loginPassword',
      desc: {
        zh: 'SSH登录密码。密码规则为8~30 个字符，且至少同时包含三项（大小写字母、数字和特殊符号）',
        en: `The SSH logon password. The password must be 8 to 30 characters in length and contain at least three of the following character types: uppercase letters, lowercase letters, digits, and special characters`
      }
    },
    'kubernetes-version': {
      mapping: 'CreateClusterRequest.kubernetesVersion',
      vtype: 'string',
      desc: {
        zh: 'Kubernetes集群版本，默认最新版',
        en: `The Kubernetes version. We recommend that you use the latest version.`
      }
    },
    name: {
      required:true,
      mapping: 'CreateClusterRequest.name',
      desc: {
        zh: '集群名称， 集群名称可以使用大小写英文字母、中文、数字、中划线。',
        en: `The name of the cluster. The name can contain uppercase letters, lowercase letters, Chinese characters, digits, and hyphens (-).`
      }
    },
    'node-cidr-mask': {
      mapping: 'CreateClusterRequest.nodeCidrMask',
      default: '25',
      desc: {
        zh: '节点网络的网络前缀',
        en: `The prefix length of the node CIDR block.`
      },
      attributes: {
        show: [
          {
            'addons[*].name': {
              type: 'include',
              value: 'flannel'
            }
          }
        ]
      }
    },
    'node-port-range': {
      mapping: 'CreateClusterRequest.nodePortRange',
      desc: {
        zh: '节点服务端口。取值范围为[30000，65535]',
        en: `The service port range of nodes. Valid values: 30000 to 65535.`
      },
      example: `30000-32767`
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
    'pod-vswitch-ids': {
      mapping: 'CreateClusterRequest.podVswitchIds',
      vtype: 'array',
      subType: 'string',
      desc: {
        zh: 'Pod的虚拟交换机列表，您需要为每一个节点虚拟交换机指定至少一个相同可用区的Pod虚拟交换机，并且不能跟节点vswitch重复。',
        en: `Pod VSwitch IDs, in ENI multi-network card mode, you need to pass additional vswitchid to addon. When creating a cluster of the terway network type, this field is required.`
      },
      attributes: {
        required: [
          {
            'addons[*].name': {
              type: 'include',
              value: 'terway'
            }
          }
        ]
      }
    },
    'proxy-mode': {
      mapping: 'CreateClusterRequest.proxyMode',
      vtype: 'string',
      default:'ipvs',
      desc: {
        zh: 'kube-proxy代理模式,默认为iptables',
        en: `The kube-proxy mode. Valid values: iptables and ipvs. Default value: iptables.`
      },
      choices: [
        'iptables',
        'ipvs'
      ]
    },
    'runtime': {
      mapping: 'CreateClusterRequest.runtime',
      required:true,
      vtype: 'map',
      desc: {
        zh: '容器运行时，一般为docker，包括2个信息：name和version',
        en: `The runtime of containers. Default value: docker. Specify the runtime name and version.`
      },
      example: `name=docker,version=19.03.5`,
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
  ]
};

exports.run = function () {
  console.log('=====');
};