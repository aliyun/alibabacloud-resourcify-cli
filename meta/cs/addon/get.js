'use strict';

let { default: Client } = require(`@alicloud/cs20151215`);
let runtime = require('../../../runtime.js');
let output = require('../../../output.js');

exports.cmdObj = {
    use: 'arc cs addon get',
    desc: {
        zh: '集群安装的Addons详情'
    },
    options: {
        'region': {
            mapping: 'region',
            desc: {
                zh: '阿里云区域'
            }
        },
        'cluster-type': {
            mapping: 'clusterType',
            desc: {
                zh: '集群类型，默认为kubernetes'
            }
        }
    }
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
    let DescribeAddonsRequest = require(`@alicloud/cs20151215`).DescribeAddonsRequest;
    let request = new DescribeAddonsRequest({});

    let DescribeAddonsQuery = require('@alicloud/cs20151215').DescribeAddonsQuery;
    let query = new DescribeAddonsQuery(argv._mappingValue);

    request.query = query;

    let client = new Client(config);
    let result;
    try {
        result = await client.describeAddonsWithOptions(request, runtime.getRuntimeOption(argv));
    } catch (e) {
        output.error(e.message);

    }
    let data = JSON.stringify(result, null, 2);
    output.log(data);
};