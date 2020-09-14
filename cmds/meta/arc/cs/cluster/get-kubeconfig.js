'use strict';

let { default: Client } = require(`@alicloud/cs20151215`);
let runtime = require('../../../../../runtime.js');
let output = require('../../../../../output.js');

exports.cmdObj = {
    use: 'arc cs cluster get-kubeconfig',
    desc: {
        zh: '返回包含当前登录用户身份信息的Kubernetes集群访问kubeconfig'
    },
    options: {
        'private-ip-address': {
            mapping:'privateIpAddress',
            vtype: 'boolean',
            desc: {
                zh: '当前用户对应的集群访问kubeconfig'
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
    let DescribeClusterUserKubeconfigRequest = require(`@alicloud/cs20151215`).DescribeClusterUserKubeconfigRequest;
    let request = new DescribeClusterUserKubeconfigRequest({});

    let DescribeClusterUserKubeconfigQuery = require('@alicloud/cs20151215').DescribeClusterUserKubeconfigQuery;
    let query = new DescribeClusterUserKubeconfigQuery({});

    let flags = exports.cmdObj.flags;
    for (let key in flags) {
        if (!argv[key] || !flags[key].mapping) {
            continue;
        }
        query[flags[key].mapping] = argv[key];
    }
    request.query = query;

    let client = new Client(config);
    let result;
    try {
        result = await client.describeClusterUserKubeconfigWithOptions(argv._[0], request, runtime.getRuntimeOption(argv));
    } catch (e) {
        output.error(e.message);
    }
    if (result) {
        result = result.body;
    }
    let data = JSON.stringify(result, null, 2);
    output.log(data);
};