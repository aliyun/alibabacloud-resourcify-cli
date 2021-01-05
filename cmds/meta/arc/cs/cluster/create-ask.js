'use strict';

let { default: Client } = require(`@alicloud/cs20151215`);
let runtime = require('../../../../../lib/runtime.js');
let output = require('../../../../../lib/output.js');

exports.cmdObj = {
  desc: {
    en: 'Create a serverless cluster',
    zh: '创建 serverless 版集群'
  },
  options: {
    'cluster-type': {
      mapping: 'CreateClusterRequest.clusterType',
      unchanged: true,
      default: 'Ask',
      desc: {
        zh: '集群类型',
        en: `The type of the cluster`
      }
    },
    name: {
      required: true,
      mapping: 'CreateClusterRequest.name',
      vtype: 'string',
      desc: {
        zh: '集群名称， 集群名称可以使用大小写英文字母、中文、数字、中划线。',
        en: `The name of the cluster. The name can contain uppercase letters, lowercase letters, Chinese characters, digits, and hyphens (-).`
      }
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
    'kubernetes-version': {
      mapping: 'CreateClusterRequest.kubernetesVersion',
      vtype: 'string',
      desc: {
        zh: 'Kubernetes集群版本，默认最新版',
        en: `The Kubernetes version. We recommend that you use the latest version.`
      }
    },
    'private-zone': {
      mapping: 'CreateClusterRequest.privateZone',
      vtype: 'boolean',
      desc: {
        zh: '是否开启PrivateZone用于服务发现',
        // TODO
        en: ``
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
    'endpoint-public-access': {
      mapping: 'CreateClusterRequest.endpointPublicAccess',
      vtype: 'boolean',
      desc: {
        zh: '是否开启公网API Server',
        en: `Specifies whether to enable Internet access to the API server.`
      },
      default: true
    },
    'service-discovery-types': {
      mapping: 'CreateClusterRequest.serviceDiscoveryTypes',
      vtype: 'array',
      subType: 'string',
      desc: {
        zh: '服务发现方式',
        // TODO
        en: ``
      }
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
    'deletion-protection': {
      mapping: 'CreateClusterRequest.deletionProtection',
      vtype: 'boolean',
      default: false,
      desc: {
        zh: '是否开启集群删除保护，防止通过控制台或API误删除集群',
        en: `Specifies whether to enable cluster deletion protection. If this option is enabled, the cluster cannot be deleted by operations in the console or API operations.`
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
    'timezone': {
      mapping: 'CreateClusterRequest.timezone',
      vtype: 'string',
      desc: {
        zh: '时区',
        en: `timezone`
      }
    },
    'nat-gateway': {
      mapping: 'CreateClusterRequest.natGateway',
      vtype: 'boolean',
      default: false,
      desc: {
        zh: '创建ASK集群时，是否在VPC中创建NAT网关并配置SNAT规则',
        // TODO
        en: ``
      }
    },
    'zoneId': {
      mapping: 'CreateClusterRequest.zoneId',
      vtype: 'string',
      desc: {
        zh: '可用区ID',
        // TODO
        en: ``
      }
    }, 
    'vpcid': {
      mapping: 'CreateClusterRequest.vpcid',
      vtype: 'string',
      desc: {
        zh: '集群使用的VPC',
        en: `The ID of the VPC.`
      }, 
      attributes: {
        show: [
          {
            'vswitch-ids': {
              type: 'any'
            }
          }
        ],
        required: [
          {
            'vswitch-ids': {
              type: 'any'
            }
          }
        ],
      },
    },
    'vswitch-ids': {
      mapping: 'CreateClusterRequest.vswitchIds',
      vtype: 'array',
      subType: 'string',
      maxindex: 3,
      desc: {
        zh: '交换机ID。List长度范围为[1，3]',
        // TODO
        en: ``
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
      default: false
    },
  },
  conflicts: [
    {
      optNames: ['security-group-id', 'is-enterprise']
    },
    {
      optNames: ['vswitch-ids', 'zoneId'],
      required: true
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
