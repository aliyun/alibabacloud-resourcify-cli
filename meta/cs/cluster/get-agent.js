'use strict';

let { default: Client } = require(`@alicloud/cs20151215`);
let runtime = require('../../../runtime.js');
let output = require('../../../output.js');

exports.cmdObj={
    use:'arc cs cluster get-agent',
    desc:{
        zh:'获取一个agent YAML文件，您可以将改YAML文件部署到自己的集群用于访问apiServer'
    },
    args:[
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
    let DescribeExternalAgentRequest = require(`@alicloud/cs20151215`).DescribeExternalAgentRequest;
    let request = new DescribeExternalAgentRequest({});

    let client = new Client(config);
    let result;
    try {
        result = await client.describeExternalAgentWithOptions(argv._[0], request, runtime.getRuntimeOption(argv));
    } catch (e) {
        output.error(e.message);

    }
    let data = JSON.stringify(result, null, 2);
    output.log(data);
};