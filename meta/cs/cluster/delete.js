'use strict';

let { default: Client } = require(`@alicloud/cs20151215`);
let runtime = require('../../../runtime.js');
let output = require('../../../output.js');

exports.cmdObj = {
    use: 'arc cs cluster delete',
    desc: {
        zh: '根据集群ID删除集群'
    },
    args: [
        {
            name: 'clusterId',
            variable: true,
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
    let DeleteClusterRequest = require(`@alicloud/cs20151215`).DeleteClusterRequest;
    let request = new DeleteClusterRequest({});
    let client = new Client(config);
    for (let id of argv._) {
        await client.deleteClusterWithOptions(id, request, runtime.getRuntimeOption(argv)).then(result => {
            let data = JSON.stringify(result, null, 2);
            output.log(data);
        }).catch(e => {
            output.error(e.message);
        });
    }
};