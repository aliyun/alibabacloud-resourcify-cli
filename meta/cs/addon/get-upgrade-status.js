'use strict';

let { default: Client } = require(`@alicloud/cs20151215`);
let runtime = require('../../../runtime.js');
let output = require('../../../output.js');

exports.cmdObj = {
    use: 'arc cs addon get-upgrade-status',
    desc: {
        zh: '查询集群Addons升级状态'
    },
    args: [
        {
            name: 'clusterId',
            required: true
        },
        {
            name:'componentId',
            required:true
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
    let DescribeClusterAddonUpgradeStatusRequest = require(`@alicloud/cs20151215`).DescribeClusterAddonUpgradeStatusRequest;
    let request = new DescribeClusterAddonUpgradeStatusRequest({});

    let client = new Client(config);
    let result;
    try {
        result = await client.describeClusterAddonUpgradeStatusWithOptions(argv._[0],argv._[1], request, runtime.getRuntimeOption(argv));
    } catch (e) {
        output.error(e.message);

    }
    let data = JSON.stringify(result, null, 2);
    output.log(data);
};