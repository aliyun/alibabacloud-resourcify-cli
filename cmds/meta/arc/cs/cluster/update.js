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
      mapping: 'apiServerEip',
      vtype: 'boolean',
      desc: {
        zh: '集群是否开启EIP',
        en: `Specifies whether to assign an elastic IP address to the API server of the cluster.`
      },
      sufficient: function (val) {
        let optList = {};
        if (val) {
          optList['api-server-eip-id'] = true;
        }
        return optList;
      }
    },
    'api-server-eip-id': {
      mapping: 'apiServerEipId',
      dependency: true,
      desc: {
        zh: 'Kubernetes集群的apiServer的弹性IP（EIP）ID',
        en: `The ID of the elastic IP address that is assigned to the API server of the cluster.`
      }
    },
    'deletion-protection': {
      mapping: 'deletionProtection',
      vtype: 'boolean',
      desc: {
        zh: '是否开启集群删除保护',
        en: `Specifies whether to enable deletion protection for the cluster.`
      }
    },
    'ingress-domain-rebinding': {
      mapping: 'ingressDomainRebinding',
      vtype: 'boolean',
      desc: {
        zh: '是否重新绑定域名到ingress的SLB地址',
        en: `Specifies whether to rebind the default domain name of the cluster to the public IP address of the SLB instance associated with the ingresses of the cluster.`
      }
    },
    'ingress-loadbalancer-id': {
      mapping: 'ingressLoadbalancerId',
      desc: {
        zh: 'Kubernetes集群的ingress loadbalancer的ID',
        en: `The ID of the Server Load Balancer (SLB) instance associated with the ingresses of the cluster.`
      }
    },
    'resource-group-id': {
      mapping: 'resourceGroupId',
      desc: {
        zh: 'Kubernetes集群资源组ID',
        en: 'The ID of the resource group to which the cluster belongs.'
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
  let ModifyClusterRequest = require(`@alicloud/cs20151215`).ModifyClusterRequest;
  let request = new ModifyClusterRequest(argv._mappingValue);

  let client = new Client(config);
  let result;
  try {
    result = await client.modifyClusterWithOptions(argv._[0], request, {}, runtime.getRuntimeOption(argv));
  } catch (e) {
    output.error(e.message);
  }
  if (result) {
    result = result.body;
  }
  let data = JSON.stringify(result, null, 2);
  output.log(data);
};
