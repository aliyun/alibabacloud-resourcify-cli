'use strict';

let { default: Client } = require(`@alicloud/cs20151215`);
let runtime = require('../../../runtime.js');
let output = require('../../../output.js');

exports.cmdObj = {
    use: 'arc cs cluster get-update-status',
    desc: {
        zh: '查询集群升级状态'
    },
    args: [
        {
            name: 'clusterId',
            required: true,
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
    let GetUpgradeStatusRequest = require(`@alicloud/cs20151215`).GetUpgradeStatusRequest;
    let request = new GetUpgradeStatusRequest({});
    let client = new Client(config);
    let result;
    try {
        result = await client.getUpgradeStatusWithOptions(argv._[0], request, runtime.getRuntimeOption(argv));
    } catch (e) {
        output.error(e.message);
    }
    if (result) {
        result = result.body;
    }
    let data = JSON.stringify(result, null, 2);
    output.log(data);
};