'use strict';

let { default: Client } = require(`@alicloud/cs20151215`);
let runtime = require('../../../../../runtime.js');
let output = require('../../../../../output.js');

exports.cmdObj = {
    use: 'arc cs cluster upgrade',
    desc: {
        zh: '升级指定用户集群版本'
    },
    args: [
        {
            name: 'clusterId',
            required: true
        },
        {
            name: 'version',
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
    let UpgradeClusterRequest = require(`@alicloud/cs20151215`).UpgradeClusterRequest;
    let request = new UpgradeClusterRequest({});

    let UpgradeClusterBody = require('@alicloud/cs20151215').UpgradeClusterBody;
    let body = new UpgradeClusterBody({});

    body.version = argv._[1];
    request.body = body;

    let client = new Client(config);
    let result;
    try {
        result = await client.upgradeClusterWithOptions(argv._[0], request, runtime.getRuntimeOption(argv));
    } catch (e) {
        output.error(e.message);
    }
    let data = JSON.stringify(result, null, 2);
    output.log(data);
};