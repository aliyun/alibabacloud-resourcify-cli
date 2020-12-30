'use strict';

let { default: Client } = require(`@alicloud/cs20151215`);
let runtime = require('../../../../../lib/runtime.js');
let output = require('../../../../../lib/output.js');

exports.cmdObj = {
  desc: {
    zh: '修改集群信息',
    en: ` modify the configurations of a cluster.`
  },
  options: {
    'api-server-eip': {
      mapping: 'ModifyClusterRequest.apiServerEip',
      vtype: 'boolean',
      desc: {
        zh: '集群是否开启EIP',
        en: `Specifies whether to assign an elastic IP address to the API server of the cluster.`
      }
    },
    'api-server-eip-id': {
      mapping: 'ModifyClusterRequest.apiServerEipId',
      desc: {
        zh: 'Kubernetes集群的apiServer的弹性IP（EIP）ID',
        en: `The ID of the elastic IP address that is assigned to the API server of the cluster.`
      },
      attributes: {
        show: [
          {
            'api-server-eip': {
              type: 'equal',
              value: true
            }
          }
        ],
        required: [
          {
            'api-server-eip': {
              type: 'equal',
              value: true
            }
          }
        ]
      }
    },
    'deletion-protection': {
      mapping: 'ModifyClusterRequest.deletionProtection',
      vtype: 'boolean',
      desc: {
        zh: '是否开启集群删除保护',
        en: `Specifies whether to enable deletion protection for the cluster.`
      }
    },
    'instance-deletion-protection': {
      mapping: 'ModifyClusterRequest.instanceDeletionProtection',
      vtype: 'boolean',
      desc: {
        zh: '实例删除保护，防止通过控制台或API误删除释放节点',
        // TODO 
        en: ''
      }
    },
    'ingress-domain-rebinding': {
      mapping: 'ModifyClusterRequest.ingressDomainRebinding',
      vtype: 'boolean',
      desc: {
        zh: '是否重新绑定域名到ingress的SLB地址',
        en: `Specifies whether to rebind the default domain name of the cluster to the public IP address of the SLB instance associated with the ingresses of the cluster.`
      }
    },
    'ingress-loadbalancer-id': {
      mapping: 'ModifyClusterRequest.ingressLoadbalancerId',
      vtype: 'string',
      desc: {
        zh: 'Kubernetes集群的ingress loadbalancer的ID',
        en: `The ID of the Server Load Balancer (SLB) instance associated with the ingresses of the cluster.`
      }
    },
    'resource-group-id': {
      mapping: 'ModifyClusterRequest.resourceGroupId',
      vtype: 'string',
      desc: {
        zh: 'Kubernetes集群资源组ID',
        en: 'The ID of the resource group to which the cluster belongs.'
      }
    },
    'maintenance-window': {
      mapping: 'ModifyClusterRequest.maintenanceWindow',
      vtype: 'map',
      options: {
        'enable': {
          mapping: 'enable',
          vtype: 'boolean',
          desc: {
            zh: '是否开启维护窗口',
            //TODO
            en: ''
          },
          default: false
        },
        'maintenance-time': {
          mapping: 'maintenanceTime',
          vtype: 'string',
          desc: {
            zh: '维护起始时间。Golang标准时间格式"15:04:05Z"',
            //TODO
            en: ''
          }
        },
        'duration': {
          mapping: 'duration',
          vtype: 'string',
          desc: {
            zh: '维护时长。取值范围1～24，单位为小时,默认值：3h',
            //TODO
            en: ''
          },
          default: '3h'
        },
        'weekly-period': {
          mapping: 'weeklyPeriod',
          vtype: 'string',
          desc: {
            zh: '维护周期。取值范围为:Monday~Sunday，多个值用逗号分隔',
            //TODO
            en: ''
          },
          default: 'Thursday'
        }
      },
      desc: {
        // TODO 
        zh: '',
        en: ''
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
  let ModifyClusterRequest = require(`@alicloud/cs20151215`).ModifyClusterRequest;
  let request = new ModifyClusterRequest(ctx.mappingValue.ModifyClusterRequest);

  let client = new Client(config);
  let result;
  try {
    result = await client.modifyClusterWithOptions(ctx.argv[0], request, {}, runtime.getRuntimeOption());
  } catch (e) {
    output.error(e.message);
  }
  if (result) {
    result = result.body;
  }
  let data = JSON.stringify(result, null, 2);
  output.log(data);
};
