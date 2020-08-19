'use strict';

let { default: Client } = require(`@alicloud/cs20151215`);
let runtime = require('../../../runtime.js');
let output = require('../../../output.js');

exports.cmdObj = {
    use: 'arc cs addon install',
    desc: {
        zh: '安装集群插件'
    },
    options: {
        'name': {
            mapping: 'name',
            desc: {
                zh: 'addon名称'
            }
        },
        'version': {
            mapping: 'version',
            desc: {
                zh: '插件版本'
            }
        },
        'disabled': {
            mapping: 'disabled',
            vtype: 'boolean',
            desc: {
                zh: '是否禁止默认安装'
            }
        },
        'required': {
            mapping: 'required',
            desc: {
                zh: '是否默认安装'
            }
        },
        'config': {
            mapping: 'config',
            desc: {
                zh: '配置信息',
                en: ''
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
    let InstallClusterAddonsRequest = require(`@alicloud/cs20151215`).InstallClusterAddonsRequest;
    let request = new InstallClusterAddonsRequest({});

    let InstallClusterAddonsBody = require('@alicloud/cs20151215').InstallClusterAddonsBody;
    let body = new InstallClusterAddonsBody(argv._mappingValue);

    request.body = body;

    let client = new Client(config);
    let result;
    try {
        result = await client.installClusterAddonsWithOptions(argv._[0], request, runtime.getRuntimeOption(argv));
    } catch (e) {
        output.error(e.message);

    }
    let data = JSON.stringify(result, null, 2);
    output.log(data);
};