'use strict';

let { default: Client } = require(`@alicloud/cs20151215`);
let runtime = require('../../../../../runtime.js');
let output = require('../../../../../output.js');

exports.cmdObj = {
    use: 'arc cs cluster upgrade-restart',
    desc: {
        zh: '重新开始集群升级'
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
    let ResumeUpgradeClusterRequest = require(`@alicloud/cs20151215`).ResumeUpgradeClusterRequest;
    let request = new ResumeUpgradeClusterRequest({});
    let client = new Client(config);
    let result;
    try {
        result = await client.resumeUpgradeClusterWithOptions(argv._[0], request, runtime.getRuntimeOption(argv));
    } catch (e) {
        output.error(e.message);
    }
    let data = JSON.stringify(result, null, 2);
    output.log(data);
};