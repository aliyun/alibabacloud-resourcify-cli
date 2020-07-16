'use strict';

let { default: Client } = require(`@alicloud/cs20151215`);
let runtime = require('../../../runtime.js');
let output = require('../../../output.js');
exports.cmdObj = {
    use: 'arc cs cluster list',
    desc: {
        zh: '查看您在容器服务中创建的所有集群（包括Swarm和Kubernetes集群）'
    },
    flags: {
        name: {
            mapping: 'name',
            desc: {
                zh: '根据集群Name进行模糊匹配查询'
            }
        },
        'cluster-type': {
            mapping: 'clusterType',
            desc: {
                zh: '集群类型'
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
    let DescribeClustersRequest = require(`@alicloud/cs20151215`).DescribeClustersRequest;
    let request = new DescribeClustersRequest({});
    let DescribeClustersQuery = require(`@alicloud/cs20151215`).DescribeClustersQuery;
    let query = new DescribeClustersQuery({});

    let flags = exports.cmdObj.flags;
    for (let key in flags) {
        if (!argv[key] || !flags[key].mapping) {
            continue;
        }
        query[flags[key].mapping] = argv[key];
    }
    let client = new Client(config);
    await client.describeClustersWithOptions(request, runtime.getRuntimeOption(argv)).then(result => {
        let data = JSON.stringify(result, null, 2);
        output.log(data);
    }).catch(e => {
        output.error(e.message);
    });
};