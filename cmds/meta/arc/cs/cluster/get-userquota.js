'use strict';

let { default: Client } = require(`@alicloud/cs20151215`);
let runtime = require('../../../../../runtime.js');
let output = require('../../../../../output.js');
exports.cmdObj = {
    use: 'arc cs cluster get-userquota',
    desc: {
        zh: '查询用户配额'
    }
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
    let DescribeUserQuotaRequest = require(`@alicloud/cs20151215`).DescribeUserQuotaRequest;
    let request = new DescribeUserQuotaRequest({});
    let client = new Client(config);
    let result;
    try {
        result = await client.describeUserQuotaWithOptions(request, runtime.getRuntimeOption(argv));
    } catch (e) {
        output.error(e.message);
    }
    if (result) {
        result = result.body;
    }
    let data = JSON.stringify(result, null, 2);
    output.log(data);
};