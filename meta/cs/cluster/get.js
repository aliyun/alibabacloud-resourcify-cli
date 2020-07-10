'use strict';



let { default: Client } = require(`@alicloud/cs20151215`);
let runtime = require('../../../runtime.js');

exports.cmdObj = {
    use: 'arc cs cluster get',
    long:{
        zh:'根据集群ID，查看集群的详细信息'
    },
    args: [
        {
            name: 'clusterId',
            required: true
        }
    ]
};

exports.run = async function (argv) {
    let profile = await runtime.getConfigOption(argv);
    let { Config } = require('@alicloud/roa-client');
    let config = new Config({
        accessKeyId: profile.access_key_id,
        accessKeySecret: profile.access_key_secret,
        securityToken: profile.sts_token,
        regionId: profile.region,
        type: profile.type
    });
    let DescribeClusterDetailRequest = require(`@alicloud/cs20151215`).DescribeClusterDetailRequest;
    let request = new DescribeClusterDetailRequest({});
    let client = new Client(config);
    for (let id of argv._) {
        client.describeClusterDetailWithOptions(id,request, runtime.getRuntimeOption(argv)).then(result => {
            let data = JSON.stringify(result, null, 2);
            console.log(data);
        }).catch(e => {
            console.error(e.message);
        });
    }
};