'use strict';

let { default: Client } = require(`@alicloud/cs20151215`);
let runtime = require('../../../../../runtime.js');
let output = require('../../../../../output.js');

// TODO
// 请求结构和文档不一致
exports.cmdObj = {
    use: 'arc cs addon uninstall',
    desc: {
        zh: '卸载集群插件'
    },
    options: {
        'name': {
            mapping: 'name',
            required: true,
            desc: {
                zh: 'addon名称'
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
    let { Config } = require('@alicloud/openapi-client');
    let config = new Config({
        accessKeyId: profile.access_key_id,
        accessKeySecret: profile.access_key_secret,
        securityToken: profile.sts_token,
        regionId: profile.region,
        type: profile.type
    });
    let UnInstallClusterAddonsRequest = require(`@alicloud/cs20151215`).UnInstallClusterAddonsRequest;
    let request = new UnInstallClusterAddonsRequest(argv._mappingValue);

    let client = new Client(config);

    try {
        await client.unInstallClusterAddonsWithOptions(argv._[0], request, {}, runtime.getRuntimeOption(argv));
    } catch (e) {
        output.error(e.message);
    }

};