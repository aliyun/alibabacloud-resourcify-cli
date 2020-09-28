'use strict';

let { default: Client } = require(`@alicloud/cs20151215`);
let runtime = require('../../../../../runtime.js');
let output = require('../../../../../output.js');

exports.cmdObj = {
    use: 'arc cs addon get-upgrade-status',
    desc: {
        zh: '查询集群Addons升级状态',
        en: `query the upgrade status of a cluster add-on.`
    },
    args: [
        {
            name: 'clusterId',
            required: true
        },
        {
            name: 'componentId',
            required: true
        }
    ]
};

exports.run = async function (argv) {
    let profile = await runtime.getConfigOption();
    let { Config } = require('@alicloud/openapi-client');
    let config = new Config({
        accessKeyId: profile.access_key_id,
        accessKeySecret: profile.access_key_secret,
        securityToken: profile.sts_token,
        regionId: profile.region,
        type: profile.type
    });

    let client = new Client(config);
    let result;
    try {
        result = await client.describeClusterAddonUpgradeStatusWithOptions(argv._[0], argv._[1], {}, runtime.getRuntimeOption(argv));
    } catch (e) {
        output.error(e.message);
    }
    if (result) {
        result = result.body;
    }
    let data = JSON.stringify(result, null, 2);
    output.log(data);
};