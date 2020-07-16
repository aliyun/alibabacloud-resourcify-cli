'use strict';



let { default: Client } = require(`@alicloud/cs20151215`);
let runtime = require('../../../runtime.js');
let output = require('../../../output.js');

exports.cmdObj = {
    use: 'arc cs cluster update',
    desc: {
        zh: '修改集群信息'
    },
    flags: {
        'api-server-eip': {
            mapping: 'apiServerEip',
            vtype: 'boolean',
            desc: {
                zh: '集群是否开启EIP'
            }
        },
        'api-server-eip-id': {
            mapping: 'apiServerEipId',
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
    required: [
        'api-server-eip',
        'deletion-protection',
        'ingress-domain-rebinding',
        'ingress-loadbalancer-id',
        'resource-group-id'
    ],
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
    let body = new ModifyClusterBody({});

    let flags = exports.cmdObj.flags;
    for (let key in flags) {
        if (!argv[key] || !flags[key].mapping) {
            continue;
        }
        body[flags[key].mapping] = argv[key];
    }
    request.body = body;

    let client = new Client(config);
    client.modifyClusterWithOptions(argv._[0], request, runtime.getRuntimeOption(argv)).then(result => {
        let data = JSON.stringify(result, null, 2);
        output.log(data);
    }).catch(e => {
        output.error(e.message);
    });
};