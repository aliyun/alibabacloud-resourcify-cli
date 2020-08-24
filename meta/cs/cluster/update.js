'use strict';

let { default: Client } = require(`@alicloud/cs20151215`);
let runtime = require('../../../runtime.js');
let output = require('../../../output.js');

exports.cmdObj = {
    use: 'arc cs cluster update',
    desc: {
        zh: '修改集群信息'
    },
    options: {
        'api-server-eip': {
            mapping: 'apiServerEip',
            vtype: 'boolean',
            desc: {
                zh: '集群是否开启EIP'
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
            dependency:true,
            desc: {
                zh: 'Kubernetes集群的apiServer的弹性IP（EIP）ID'
            }
        },
        'deletion-protection': {
            mapping: 'deletionProtection',
            vtype: 'boolean',
            desc: {
                zh: '是否开启集群删除保护'
            }
        },
        'ingress-domain-rebinding': {
            mapping: 'ingressDomainRebinding',
            vtype: 'boolean',
            desc: {
                zh: '是否重新绑定域名到ingress的SLB地址'
            }
        },
        'ingress-loadbalancer-id': {
            mapping: 'ingressLoadbalancerId',
            desc: {
                zh: 'Kubernetes集群的ingress loadbalancer的ID'
            }
        },
        'resource-group-id': {
            mapping: 'resourceGroupId',
            desc: {
                zh: 'Kubernetes集群资源组ID',
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

exports.run = async function (argv) {
    let profile = await runtime.getConfigOption();
    let { Config } = require('@alicloud/roa-client');
    let config = new Config({
        accessKeyId: profile.access_key_id,
        accessKeySecret: profile.access_key_secret,
        securityToken: profile.sts_token,
        regionId: profile.region,
        type: profile.type
    });
    let ModifyClusterRequest = require(`@alicloud/cs20151215`).ModifyClusterRequest;
    let request = new ModifyClusterRequest({});

    let ModifyClusterBody = require('@alicloud/cs20151215').ModifyClusterBody;
    let body = new ModifyClusterBody(argv._mappingValue);

    request.body = body;

    let client = new Client(config);
    let result;
    try {
        result = await client.modifyClusterWithOptions(argv._[0], request, runtime.getRuntimeOption(argv));
    } catch (e) {
        output.error(e.message);
    }
    if (result) {
        result = result.body;
    }
    let data = JSON.stringify(result, null, 2);
    output.log(data);
};
