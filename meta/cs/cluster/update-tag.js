'use strict';

let { default: Client } = require(`@alicloud/cs20151215`);
let runtime = require('../../../runtime.js');
let output = require('../../../output.js');

exports.cmdObj = {
    use: 'arc cs cluster update-tag',
    desc: {
        zh: '修改当前Kubernetes集群的tag接口'
    },
    options: {
        key:{
            required:true,
            mapping:'key',
            desc:{
                zh:'标签名称'
            }
        },
        value:{
            required:true,
            mapping:'value',
            desc:{
                zh:'标签值'
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
    let ModifyClusterTagsRequest = require(`@alicloud/cs20151215`).ModifyClusterTagsRequest;
    let request = new ModifyClusterTagsRequest({});

    let ModifyClusterTagsBody = require('@alicloud/cs20151215').ModifyClusterTagsBody;
    let body = new ModifyClusterTagsBody(argv._mappingValue);

    request.body = body;

    let client = new Client(config);
    let result;
    try {
        result = await client.modifyClusterTagsWithOptions(argv._[0], request, runtime.getRuntimeOption(argv));
    } catch (e) {
        output.error(e.message);

    }
    let data = JSON.stringify(result, null, 2);
    output.log(data);
};